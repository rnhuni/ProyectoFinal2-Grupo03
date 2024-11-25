import pytest
from unittest.mock import MagicMock, patch
from ServicioCanal.models.model import session
from ServicioCanal.models.template import Template
from ServicioCanal.commands.template_get import GetTemplate

class TestGetTemplate:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_template = MagicMock()

    def test_get_template_success(self):
        self.mock_template.id = 1
        self.mock_template.name = "Test Template"
        self.mock_template.content_type = "text/html"
        self.mock_template.body = "<p>Test Body</p>"
        self.mock_template.auto_trigger = False
        self.mock_template.status = "ENABLED"
        self.mock_template.trigger_event = "on_event"

        self.mock_query.return_value.get.return_value = self.mock_template

        command = GetTemplate(1)
        template = command.execute()

        self.mock_query.assert_called_once_with(Template)
        self.mock_query.return_value.get.assert_called_once_with(1)

        assert template == self.mock_template
        assert template.id == 1
        assert template.name == "Test Template"
        assert template.content_type == "text/html"
        assert template.body == "<p>Test Body</p>"

    def test_get_template_invalid_id(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            GetTemplate(None).execute()

        self.mock_query.assert_not_called()

    def test_get_template_not_found(self):
        self.mock_query.return_value.get.return_value = None

        command = GetTemplate(999)
        template = command.execute()

        self.mock_query.assert_called_once_with(Template)
        self.mock_query.return_value.get.assert_called_once_with(999)

        assert template is None

    def test_get_template_database_error(self):
        self.mock_query.return_value.get.side_effect = Exception("Database error")

        with pytest.raises(Exception, match="Database error"):
            GetTemplate(1).execute()

        self.mock_query.assert_called_once_with(Template)
        self.mock_query.return_value.get.assert_called_once_with(1)
