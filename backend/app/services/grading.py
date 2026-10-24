import json
from typing import Any, Dict, List, Optional

from app.services.llm import llm_client
from app.core.config import settings


class GradingService:
    async def grade(self, submission_text: Optional[str], image_keys: List[str], rubric_criteria: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not rubric_criteria:
            rubric_criteria = [{"name": "Overall", "max_points": 1, "description": "Overall correctness"}]

        content: List[Dict[str, Any]] = []
        if submission_text:
            content.append({"type": "text", "text": f"Submission:\n{submission_text}"})
        for k in image_keys or []:
            content.append({"type": "text", "text": f"[Image: {k}]"})

        system = {
            "role": "system",
            "content": (
                "You are a math K-12 grader. Grade strictly by rubric. "
                "Return valid JSON matching schema: scores (per criterion with name, score, max, comment), total_score, max_score, feedback. "
                "Be fair, specific, and actionable. Use deterministic rubric scoring first where applicable."
            ),
        }
        rubric_text = json.dumps(rubric_criteria)
        user_msg = {"role": "user", "content": content + [{"type": "text", "text": f"Rubric:\n{rubric_text}\nReturn JSON only."}]}
        messages = [system, user_msg]
        try:
            result = await llm_client.grade_with_vision(messages, model=settings.LLM_MODEL_GRADE)
        except Exception as e:
            # deterministic fallback
            total = 0
            maxs = 0
            scores = []
            for c in rubric_criteria:
                m = c.get("max_points", 1)
                scores.append({"name": c.get("name"), "score": m, "max": m, "comment": "Rubric-based scoring (fallback)"})
                total += m
                maxs += m
            result = {"scores": scores, "total_score": total, "max_score": maxs or 1, "feedback": f"Graded with rubric fallback: {str(e)[:100]}"}
        if "scores" not in result:
            raise ValueError("Invalid grading result")
        if not result.get("max_score"):
            result["max_score"] = sum(s.get("max", 0) for s in result.get("scores", [])) or 1
        if not result.get("total_score"):
            result["total_score"] = sum(s.get("score", 0) for s in result.get("scores", []))
        return result


grading_service = GradingService()
