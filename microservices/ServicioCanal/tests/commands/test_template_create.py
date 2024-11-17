import pytest
from unittest.mock import MagicMock, patch
from ServicioCanal.models.model import session
from ServicioCanal.models.template import Template
from ServicioCanal.commands.template_create import CreateTemplate

class TestCreateTemplate:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

    def test_create_template_success(self):
        test_name = "Test Template"
        test_content_type = "text/html"
        test_body = "<p>Test Body</p>"
        test_auto_trigger = False
        test_status = "ENABLED"
        test_trigger_event = "on_event"

        command = CreateTemplate(
            test_name, 
            test_content_type, 
            test_body, 
            test_auto_trigger, 
            test_status, 
            test_trigger_event
        )
        template_created = command.execute()

        self.mock_add.assert_called_once_with(template_created)
        self.mock_commit.assert_called_once()

        assert isinstance(template_created, Template)
        assert template_created.name == test_name
        assert template_created.content_type == test_content_type
        assert template_created.body == test_body
        assert template_created.auto_trigger == test_auto_trigger
        assert template_created.status == test_status
        assert template_created.trigger_event == test_trigger_event

    def test_create_template_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateTemplate("", "text/html", "<p>Body</p>", False, "ENABLED", "on_event").execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()

    def test_create_template_database_error(self):
        test_name = "Test Template"
        test_content_type = "text/html"
        test_body = "<p>Test Body</p>"
        test_auto_trigger = False
        test_status = "ENABLED"
        test_trigger_event = "on_event"

        self.mock_add.side_effect = Exception("Database error")

        with pytest.raises(Exception, match="Database error"):
            CreateTemplate(
                test_name, 
                test_content_type, 
                test_body, 
                test_auto_trigger, 
                test_status, 
                test_trigger_event
            ).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()
