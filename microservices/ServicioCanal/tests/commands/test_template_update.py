import pytest
from unittest.mock import MagicMock, patch
from ServicioCanal.models.model import session
from ServicioCanal.models.template import Template
from ServicioCanal.commands.template_update import UpdateTemplate

class TestUpdateTemplate:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

        self.mock_template = MagicMock()
        self.mock_template.id = 1
        self.mock_template.name = "Original Template"
        self.mock_template.content_type = "text/html"
        self.mock_template.body = "<p>Original Body</p>"
        self.mock_template.auto_trigger = False
        self.mock_template.status = "DISABLED"
        self.mock_template.trigger_event = "on_event"

    def test_update_template_success(self):
        updated_name = "Updated Template"
        updated_content_type = "application/json"
        updated_body = '{"key": "value"}'
        updated_auto_trigger = True
        updated_status = "ENABLED"
        updated_trigger_event = "on_update_event"

        command = UpdateTemplate(
            self.mock_template, 
            updated_name, 
            updated_content_type, 
            updated_body, 
            updated_auto_trigger, 
            updated_status, 
            updated_trigger_event
        )
        updated_template = command.execute()

        assert updated_template.name == updated_name
        assert updated_template.content_type == updated_content_type
        assert updated_template.body == updated_body
        assert updated_template.auto_trigger == updated_auto_trigger
        assert updated_template.status == updated_status
        assert updated_template.trigger_event == updated_trigger_event

        self.mock_commit.assert_called_once()

    def test_update_template_partial_update(self):
        updated_body = '{"partial": "update"}'

        command = UpdateTemplate(
            self.mock_template, 
            None,
            None,
            updated_body,
            None,
            None,
            None 
        )
        updated_template = command.execute()

        assert updated_template.name == "Original Template"
        assert updated_template.content_type == "text/html"
        assert updated_template.body == updated_body
        assert updated_template.auto_trigger == False
        assert updated_template.status == "DISABLED"
        assert updated_template.trigger_event == "on_event"

        self.mock_commit.assert_called_once()

    def test_update_template_invalid_template(self):
        command = UpdateTemplate(
            None,
            "Updated Template",
            "application/json",
            '{"key": "value"}',
            True,
            "ENABLED",
            "on_update_event"
        )
        with pytest.raises(ValueError, match="Invalid data provided"):
            command.execute()

        self.mock_commit.assert_not_called()

    def test_update_template_database_error(self):
        self.mock_commit.side_effect = Exception("Database error")

        command = UpdateTemplate(
            self.mock_template,
            "Updated Template",
            "application/json",
            '{"key": "value"}',
            True,
            "ENABLED",
            "on_update_event"
        )

        with pytest.raises(Exception, match="Database error"):
            command.execute()

        self.mock_rollback.assert_called_once()

        self.mock_commit.assert_called_once()
