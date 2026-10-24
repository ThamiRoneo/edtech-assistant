import json
from typing import Any, Dict, List, Optional

from app.services.llm import llm_client
from app.core.config import settings


RUBRIC_SCHEMA = {
    "type": "object",
    "required": ["scores", "total_score", "max_score", "feedback"],
    "properties": {
        "scores": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["name", "score", "max"],
                "properties": {
                    "name": {"type": "string"},
                    "score": {"type": "number"},
                    "max": {"type": "number"},
                    "comment": {"type": "string"},
                },
            },
        },
        "total_score": {"type": "number"},
        "max_score": {"type": "number"},
        "feedback": {"type": "string"},
    },
}


class GradingService:
    async def grade(self, submission_text: Optional[str], image_keys: List[str], rubric_criteria: List[Dict[str, Any]]) -> Dict[str, Any]:
        # deterministic first pass
        if not rubric_criteria:
            rubric_criteria = [{"name": "Overall", "max_points": 1, "description": "Overall correctness"}]

        # build messages for LLM vision if images present
        content: List[Dict[str, Any]] = []
        if submission_text:
            content.append({"type": "text", "text": f"Submission:\n{submission_text}"})
        for k in image_keys or []:
            # For now, pass key as reference; in practice fetch from storage
            content.append({"type": "text", "text": f"[Image: {k}]"})

        system = {
            "role": "system",
            "content": (
                "You are a math K-12 grader. Grade strictly by rubric. "
                "Return valid JSON matching schema: scores (per criterion with name, score, max, comment), total_score, max_score, feedback. "
                "Be fair, specific, and actionable."
            ),
        }
        rubric_text = json.dumps(rubric_criteria)
        user_msg = {"role": "user", "content": content + [{"type": "text", "text": f"Rubric:\n{rubric_text}\nReturn JSON only."}]}
        messages = [system, user_msg]
        result = await llm_client.grade_with_vision(messages, model=settings.LLM_MODEL_GRADE)
        # basic validation
        if "scores" not in result:
            raise ValueError("Invalid grading result")
        return result


grading_service = GradingService()
