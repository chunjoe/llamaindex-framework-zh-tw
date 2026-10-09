---
title: "Multi-agent 模式在 LlamaIndex 中"
---

當需要多個專家來解決某個任務時，您在 LlamaIndex 中有幾種選擇，每種方式都在便利性與靈活性之間進行權衡。本文將介紹最常見的三種模式、何時選擇每種模式，並為每種方法提供一個最簡化的程式碼草圖。

1. **AgentWorkflow (內建)** – 宣告一組 agents，讓 `AgentWorkflow` 管理任務的交接。 [Section](/python/framework/understanding/agent/multi_agent/#pattern-1-agentworkflow-ie-linear-swarm-pattern) [完整 Notebook](https://developers.llamaindex.ai/python/examples/agent/agent_workflow_multi/index.md)
2. **Orchestrator pattern (內建)** – 一個「orchestrator」agent 決定下一個要呼叫哪個子 agent；這些子 agents 會作為 **tools** 暴露給它。 [Section](/python/framework/understanding/agent/multi_agent/#pattern-2-orchestrator-agent-sub-agents-as-tools) [完整 Notebook](https://developers.llamaindex.ai/python/examples/agent/agents_as_tools/index.md)
3. **Custom planner (DIY)** – 您編寫 LLM prompt（通常是 XML / JSON），自行規劃步驟，並在程式碼中命令式地呼叫 agents。 [Section](/python/framework/understanding/agent/multi_agent/#pattern-3-custom-planner-diy-prompting-parsing) [完整 Notebook](https://developers.llamaindex.ai/python/examples/agent/custom_multi_agent/index.md)

---

## 模式 1 – AgentWorkflow (即線性的「群體」模式)

**何時使用** – 您希望即開箱即用地獲得多個 agent 的行為，幾乎不需要額外的程式碼，並且對 `AgentWorkflow` 附帶的預設交接決策感到滿意。

`AgentWorkflow` 本身就是一個 [Workflow](https://developers.llamaindex.ai/python/llamaagents/workflows/) 預先配置好，可以理解 agents、狀態和 tool-calling。您提供一個包含一個或多個 agents 的 *array*，告訴它應該從哪一個開始，它將會：

1. 將使用者訊息給 *root* agent。
2. 執行 agent 選擇的任何 tools。
3. 允許 agent 在決定時將控制權「交接」給另一個 agent。
4. 重複此過程，直到 agent 返回最終答案。

**注意**：在任何時候，當前活躍的 agent 可以選擇將控制權交還給使用者。

以下是 [multi-agent 報告生成範例](https://developers.llamaindex.ai/python/examples/agent/agent_workflow_multi/index.md) 的精簡版本。三個 agents 協作進行研究、撰寫和審閱報告。（`…` 表示為簡潔而省略的程式碼。）

```
from llama_index.core.agent.workflow import AgentWorkflow, FunctionAgent


# --- create our specialist agents ------------------------------------------------
research_agent = FunctionAgent(
    name="ResearchAgent",
    description="Search the web and record notes.",
    system_prompt="You are a researcher… hand off to WriteAgent when ready.",
    llm=llm,
    tools=[search_web, record_notes],
    can_handoff_to=["WriteAgent"],
)


write_agent = FunctionAgent(
    name="WriteAgent",
    description="Writes a markdown report from the notes.",
    system_prompt="You are a writer… ask ReviewAgent for feedback when done.",
    llm=llm,
    tools=[write_report],
    can_handoff_to=["ReviewAgent", "ResearchAgent"],
)


review_agent = FunctionAgent(
    name="ReviewAgent",
    description="Reviews a report and gives feedback.",
    system_prompt="You are a reviewer…",  # etc.
    llm=llm,
    tools=[review_report],
    can_handoff_to=["WriteAgent"],
)


# --- wire them together ----------------------------------------------------------
agent_workflow = AgentWorkflow(
    agents=[research_agent, write_agent, review_agent],
    root_agent=research_agent.name,
    initial_state={
        "research_notes": {},
        "report_content": "Not written yet.",
        "review": "Review required.",
    },
)


resp = await agent_workflow.run(
    user_msg="Write me a report on the history of the web …"
)
print(resp)
```

`AgentWorkflow` 負責所有的協調工作，並即時串流事件，以便您可以讓使用者了解進度。

---

## 模式 2 – Orchestrator agent (子 agents 作為 tools)

**何時使用** – 您希望有一個單一的地方決定*每一個*步驟，以便注入自訂邏輯，但您仍然傾向於使用宣告式的 *agent as tool* 體驗，而不是編寫您自己的規劃器。

在這個模式中，您仍然會建立專家的 agents（`ResearchAgent`、`WriteAgent`、`ReviewAgent`），**但**您不要求它們彼此之間進行交接。相反地，您將每個 agent 的 `run` 方法暴露為一個 tool，並將這些 tool 提供給一個新的頂層 agent——即 *Orchestrator*。

您可以在 [agents\_as\_工具 notebook](https://developers.llamaindex.ai/python/examples/agent/agents_as_tools/index.md) 中看到完整的範例。

```
import re
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.core.workflow import Context


# assume research_agent / write_agent / review_agent defined as before
# except we really only need the `search_web` tool at a minimum




async def call_research_agent(ctx: Context, prompt: str) -> str:
    """Useful for recording research notes based on a specific prompt."""
    result = await research_agent.run(
        user_msg=f"Write some notes about the following: {prompt}"
    )


    async with ctx.store.edit_state() as ctx_state:
        ctx_state["state"]["research_notes"].append(str(result))


    return str(result)




async def call_write_agent(ctx: Context) -> str:
    """Useful for writing a report based on the research notes or revising the report based on feedback."""
    async with ctx.store.edit_state() as ctx_state:
        notes = ctx_state["state"].get("research_notes", None)
        if not notes:
            return "No research notes to write from."


        user_msg = f"Write a markdown report from the following notes. Be sure to output the report in the following format: <report>...</report>:\n\n"


        # Add the feedback to the user message if it exists
        feedback = ctx_state["state"].get("review", None)
        if feedback:
            user_msg += f"<feedback>{feedback}</feedback>\n\n"


        # Add the research notes to the user message
        notes = "\n\n".join(notes)
        user_msg += f"<research_notes>{notes}</research_notes>\n\n"


        # Run the write agent
        result = await write_agent.run(user_msg=user_msg)
        report = re.search(
            r"<report>(.*)</report>", str(result), re.DOTALL
        ).group(1)
        ctx_state["state"]["report_content"] = str(report)


    return str(report)




async def call_review_agent(ctx: Context) -> str:
    """Useful for reviewing the report and providing feedback."""
    async with ctx.store.edit_state() as ctx_state:
        report = ctx_state["state"].get("report_content", None)
        if not report:
            return "No report content to review."


        result = await review_agent.run(
            user_msg=f"Review the following report: {report}"
        )
        ctx_state["state"]["review"] = result


    return result




orchestrator = FunctionAgent(
    system_prompt=(
        "You are an expert in the field of report writing. "
        "You are given a user request and a list of tools that can help with the request. "
        "You are to orchestrate the tools to research, write, and review a report on the given topic. "
        "Once the review is positive, you should notify the user that the report is ready to be accessed."
    ),
    llm=orchestrator_llm,
    tools=[
        call_research_agent,
        call_write_agent,
        call_review_agent,
    ],
    initial_state={
        "research_notes": [],
        "report_content": None,
        "review": None,
    },
)


response = await orchestrator.run(
    user_msg="Write me a report on the history of the web …"
)
print(response)
```

因為 orchestrator 只是另一個 `FunctionAgent`，您可以免費獲得串流、tool-calling 和狀態管理——同時您仍能完全控制 agents 的呼叫方式和整體控制流程（tools 始終回傳給 orchestrator）。

---

## 模式 3 – Custom planner (DIY prompting + parsing)

**何時使用** – 最大的靈活性。您需要強制執行非常特定的規劃格式、與外部排程器整合，或收集前述模式無法即開箱即用提供的額外元數據。

在這裡，想法是您編寫一個 prompt，指示 LLM 輸出一個結構化的計畫（XML / JSON / YAML）。您自己的 Python 程式碼解析該計畫並命令式地執行它。從屬的 agents 可以是任何東西——`FunctionAgent`s、RAG pipelines 或其他服務。

以下是一個可以規劃、執行計畫並檢查是否需要進一步步驟的 workflow 的*最小*草圖。您可以在 [自訂\_多\_代理人 notebook](https://developers.llamaindex.ai/python/examples/agent/custom_multi_agent/index.md) 中看到完整的範例。

```
import re
import xml.etree.ElementTree as ET
from pydantic import BaseModel, Field
from typing import Any, Optional


from llama_index.core.llms import ChatMessage
from llama_index.core.workflow import (
    Context,
    Event,
    StartEvent,
    StopEvent,
    Workflow,
    step,
)


# Assume we created helper functions to call the agents


PLANNER_PROMPT = """You are a planner chatbot.


Given a user request and the current state, break the solution into ordered <step> blocks.  Each step must specify the agent to call and the message to send, e.g.
<plan>
  <step agent=\"ResearchAgent\">search for …</step>
  <step agent=\"WriteAgent\">draft a report …</step>
  ...
</plan>


<state>
{state}
</state>


<available_agents>
{available_agents}
</available_agents>


The general flow should be:
- Record research notes
- Write a report
- Review the report
- Write the report again if the review is not positive enough


If the user request does not require any steps, you can skip the <plan> block and respond directly.
"""




class InputEvent(StartEvent):
    user_msg: Optional[str] = Field(default=None)
    chat_history: list[ChatMessage]
    state: Optional[dict[str, Any]] = Field(default=None)




class OutputEvent(StopEvent):
    response: str
    chat_history: list[ChatMessage]
    state: dict[str, Any]




class StreamEvent(Event):
    delta: str




class PlanEvent(Event):
    step_info: str




# Modelling the plan
class PlanStep(BaseModel):
    agent_name: str
    agent_input: str




class Plan(BaseModel):
    steps: list[PlanStep]




class ExecuteEvent(Event):
    plan: Plan
    chat_history: list[ChatMessage]




class PlannerWorkflow(Workflow):
    llm: OpenAI = OpenAI(
        model="o3-mini",
        api_key="sk-proj-...",
    )
    agents: dict[str, FunctionAgent] = {
        "ResearchAgent": research_agent,
        "WriteAgent": write_agent,
        "ReviewAgent": review_agent,
    }


    @step
    async def plan(
        self, ctx: Context, ev: InputEvent
    ) -> ExecuteEvent | OutputEvent:
        # Set initial state if it exists
        if ev.state:
            await ctx.store.set("state", ev.state)


        chat_history = ev.chat_history


        if ev.user_msg:
            user_msg = ChatMessage(
                role="user",
                content=ev.user_msg,
            )
            chat_history.append(user_msg)


        # Inject the system prompt with state and available agents
        state = await ctx.store.get("state")
        available_agents_str = "\n".join(
            [
                f'<agent name="{agent.name}">{agent.description}</agent>'
                for agent in self.agents.values()
            ]
        )
        system_prompt = ChatMessage(
            role="system",
            content=PLANNER_PROMPT.format(
                state=str(state),
                available_agents=available_agents_str,
            ),
        )


        # Stream the response from the llm
        response = await self.llm.astream_chat(
            messages=[system_prompt] + chat_history,
        )
        full_response = ""
        async for chunk in response:
            full_response += chunk.delta or ""
            if chunk.delta:
                ctx.write_event_to_stream(
                    StreamEvent(delta=chunk.delta),
                )


        # Parse the response into a plan and decide whether to execute or output
        xml_match = re.search(r"(<plan>.*</plan>)", full_response, re.DOTALL)


        if not xml_match:
            chat_history.append(
                ChatMessage(
                    role="assistant",
                    content=full_response,
                )
            )
            return OutputEvent(
                response=full_response,
                chat_history=chat_history,
                state=state,
            )
        else:
            xml_str = xml_match.group(1)
            root = ET.fromstring(xml_str)
            plan = Plan(steps=[])
            for step in root.findall("step"):
                plan.steps.append(
                    PlanStep(
                        agent_name=step.attrib["agent"],
                        agent_input=step.text.strip() if step.text else "",
                    )
                )


            return ExecuteEvent(plan=plan, chat_history=chat_history)


    @step
    async def execute(self, ctx: Context, ev: ExecuteEvent) -> InputEvent:
        chat_history = ev.chat_history
        plan = ev.plan


        for step in plan.steps:
            agent = self.agents[step.agent_name]
            agent_input = step.agent_input
            ctx.write_event_to_stream(
                PlanEvent(
                    step_info=f'<step agent="{step.agent_name}">{step.agent_input}</step>'
                ),
            )


            if step.agent_name == "ResearchAgent":
                await call_research_agent(ctx, agent_input)
            elif step.agent_name == "WriteAgent":
                # Note: we aren't passing the input from the plan since
                # we're using the state to drive the write agent
                await call_write_agent(ctx)
            elif step.agent_name == "ReviewAgent":
                await call_review_agent(ctx)


        state = await ctx.store.get("state")
        chat_history.append(
            ChatMessage(
                role="user",
                content=f"I've completed the previous steps, here's the updated state:\n\n<state>\n{state}\n</state>\n\nDo you need to continue and plan more steps?, If not, write a final response.",
            )
        )


        return InputEvent(
            chat_history=chat_history,
        )
```
此方法意味著*您*擁有協調迴圈，因此您可以插入所需的任何自訂邏輯、快取或人工介入檢查。

---

## 選擇模式

| Pattern | 行數 | 彈性 | 內建串流/事件 |
| :--- | :--- | :--- | :--- |
| AgentWorkflow | ⭐ – 最少 | ★★ | 是 |
| Orchestrator agent | ⭐⭐ | ★★★ | 是 (透過 orchestrator) |
| Custom planner | ⭐⭐⭐ | ★★★★★ | 是 (透過 sub-agents)。頂層由您決定。 |

如果您需要快速原型設計，請從 `AgentWorkflow` 開始。當您需要對流程有更多控制時，請切換到 *Orchestrator agent*。只有當前兩種模式無法表達您所需流程時，才使用 *Custom planner*。

接下來您將學習如何使用 [structured output in single and multi-agent workflows](/python/framework/understanding/agent/structured_output/)