from pathlib import Path


def _web_service_section() -> str:
    blueprint = Path(__file__).resolve().parents[2] / "render.yaml"
    return blueprint.read_text().split("- type: worker", 1)[0]


def test_render_uses_readiness_check_for_web_service():
    web = _web_service_section()

    assert "healthCheckPath: /readyz" in web
    assert "healthCheckPath: /health" not in web


def test_render_applies_migrations_before_web_service_starts():
    web = _web_service_section()

    assert "preDeployCommand: alembic upgrade head" in web
