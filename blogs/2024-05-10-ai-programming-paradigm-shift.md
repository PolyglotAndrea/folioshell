# The Paradigm Shift in AI Programming
## From First Principles to Graph-Based Workflows

Software engineering is undergoing a transformation unlike anything before. As Boris Cherny, the lead behind Claude Code, has argued, code generation is increasingly becoming a solved problem.

Over the next one or two years, the traditional title of "software engineer" may gradually fade, replaced by a more versatile role: the **Builder**.

---

## I. Understanding Large Models: "The Bitter Lesson"
Traditional systems relied on manually written if-else rules. Real-world complexity proved too high for handcrafted logic.

The real breakthrough arrived in 2017 with the Transformer architecture. One principle has repeatedly proven true: **The Bitter Lesson**. General-purpose models consistently outperform systems over-engineered for narrow tasks.

## II. Capability Limits and Harness Engineering
A large language model performs a deceptively simple task: **Predict the next token**.

To address context limitations and O(n^2) complexity, we now use "Harness Engineering":
1. **Architectural Constraints**: Externalized rules into CI/linters.
2. **Execution Loops**: Task decomposition, tool invocation, and feedback.
3. **Memory Governance**: Persistent long-term documentation and specs.

## III. Claude Code in Practice: Iterative Agentic Workflows
Collect context -> Take action -> Verify results.

1. **Enable Plan Mode**: Reduce context pollution via read-only exploration.
2. **Use Subagents Aggressively**: Isolate context windows for focused tasks.
3. **Configure Skills and Hooks**: On-demand workflows and deterministic logic.

## IV. The Evolution of Ultimate Workflows: Trellis and Graphify

### 1. Trellis: An External Memory Brain for AI
Addressing session amnesia via three layers: Spec Layer, Task Layer, and Workspace Layer (Persistent memory).

### 2. Graphify: From Codebases to Knowledge Graphs
Inspired by Karpathy, Graphify compiles entire projects into knowledge graphs for precise navigation and multimodal understanding.

## Conclusion: Advice for Future Builders
1. Use the strongest models available (Opus-class).
2. Evolve into a Cross-Disciplinary Generalist.
3. Build and Preserve Your Own Spec Assets.

In the age of AI-native software development, your Specs become your institutional memory—and your real intellectual property.

---
Full article available at: https://github.com/PolyglotAndrea
