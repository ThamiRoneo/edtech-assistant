try:
    from app.services.llm import llm_client
except Exception:
    llm_client = None
import json


async def generate_distractors(question: str, correct: str, count: int = 3):
    if not llm_client or not getattr(llm_client, 'client', None):
        # simple fallback
        return [f"{correct}x", f"{correct}+1", f"{correct}-1"][:count]
    try:
        messages = [
            {"role": "system", "content": "Generate plausible incorrect distractors for a math question. Return JSON array of strings."},
            {"role": "user", "content": f"Question: {question}\nCorrect: {correct}\nReturn JSON array."},
        ]
        res = await llm_client.chat_json(messages)
        if isinstance(res, list):
            return res[:count]
        if isinstance(res, dict) and 'distractors' in res:
            return res['distractors'][:count]
    except Exception:
        pass
    return [f"{correct}x", f"{correct}+1", f"{correct}-1"][:count]
