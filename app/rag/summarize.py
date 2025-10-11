


# from typing import List, Dict
# from textwrap import dedent

# def build_prompt(topic: str, chunks: List[Dict]) -> str:
#     """
#     Build a strict summarization prompt for Ollama with explicit citation rules.
#     Each provided chunk includes a CITE line like (SOURCE:start-end).
#     """
#     sources_block = "\n\n".join(
#         f"[{i+1}] {c['text']}\nCITE: ({c['source']}:{c['start']}-{c['end']})"
#         for i, c in enumerate(chunks)
#     )
#     return dedent(f"""
#     You are a precise summarizer. Use ONLY the sources below.

#     RULES (must obey):
#     - Every sentence MUST end with exactly one citation like (SOURCE:start-end).
#     - Do NOT invent facts. If something is not in sources, say "not supported by sources".
#     - Write 5–8 concise sentences. No bullet lists.

#     EXAMPLE STYLE:
#     Input:
#     [1] Julius Caesar crossed the Rubicon... CITE: (wiki/Caesar:100-180)
#     [2] The Senate declared him an enemy... CITE: (wiki/Senate:40-110)

#     Output:
#     Caesar crossed the Rubicon, triggering civil war (wiki/Caesar:100-180).
#     The Senate’s declaration escalated the conflict (wiki/Senate:40-110).

#     SOURCES:
#     {sources_block}

#     TASK: Summarize the topic "{topic}" now.
#     """).strip()

# def summarize_with_citations(chunks: List[Dict], topic: str) -> str:
#     """
#     Simple fallback stub used if LLM call fails.
#     """
#     cites = [f"({c['source']}:{c['start']}-{c['end']})" for c in chunks[:3]]
#     return f"Summary for '{topic}' (stub). Sources: " + ", ".join(cites)





# app/rag/summarize.py
from __future__ import annotations
from typing import List, Dict
from textwrap import dedent
import re


def build_prompt(topic: str, chunks: List[Dict]) -> str:
    """
    Build a strict summarization prompt for local LLMs (Ollama).
    Forces 5–7 sentences, each ending with exactly one citation (SOURCE:start-end).
    """
    sources_block = "\n\n".join(
        f"[{i+1}] {c['text']}\nCITE: ({c['source']}:{c['start']}-{c['end']})"
        for i, c in enumerate(chunks)
    )

    return dedent(f"""
    You are a precise summarizer. Use ONLY the sources provided.

    HARD RULES (follow exactly):
    - Write 5–7 short sentences (no bullets).
    - EVERY sentence MUST end with exactly ONE citation in the form (SOURCE:start-end).
    - If a claim is NOT supported by the sources, write: "not supported by sources".
    - Do NOT define general terms unless present in the sources.
    - Keep wording concise and factual.

    EXAMPLE:
    Sources:
    [1] The senate named X ... CITE: (wiki/Senate:40-110)
    [2] Caesar crossed ... CITE: (wiki/Caesar:100-180)

    Good output:
    The senate designated X under Y (wiki/Senate:40-110).
    Caesar crossed the Rubicon in year Z (wiki/Caesar:100-180).

    SOURCES:
    {sources_block}

    TASK: Summarize the topic "{topic}" now.
    """).strip()


def ensure_citations(text: str) -> bool:
    """
    Return True if every non-empty line ends with a citation like '(SOURCE:start-end)'.
    Useful as a quick guard after LLM output.
    """
    lines = [ln.strip() for ln in text.split("\n") if ln.strip()]
    pat = re.compile(r"\([^)]+:\d+-\d+\)\s*$")
    return all(pat.search(ln) is not None for ln in lines)


def fix_citations_prompt(text: str) -> str:
    """
    Build a follow-up prompt to repair a summary so each sentence ends with one citation.
    """
    return dedent(f"""
    Fix the following summary so that EVERY sentence ends with exactly ONE citation
    in the form (SOURCE:start-end). Do not add new claims. Keep the content and wording minimal.

    SUMMARY TO FIX:
    {text}
    """).strip()


def summarize_with_citations(chunks: List[Dict], topic: str) -> str:
    """
    Simple fallback stub used if LLM call fails. Returns the first few citations.
    """
    cites = [f"({c['source']}:{c['start']}-{c['end']})" for c in chunks[:3]]
    return f"Summary for '{topic}' (stub). Sources: " + ", ".join(cites)