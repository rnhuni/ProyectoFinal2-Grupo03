import pytest
from unittest.mock import MagicMock, patch
from ServicioCanal.models.model import session
from ServicioCanal.models.template import Template
from ServicioCanal.commands.template_get_all import GetAllTemplates

class TestGetAllTemplates:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_template_1 = MagicMock()
        self.mock_template_2 = MagicMock()

    def test_get_all_templates_success(self):
        self.mock_template_1.id = 1
        self.mock_template_1.name = "Template 1"
        self.mock_template_1.content_type = "text/html"
        self.mock_template_1.body = "<p>Body 1</p>"

        self.mock_template_2.id = 2
        self.mock_template_2.name = "Template 2"
        self.mock_template_2.content_type = "application/json"
        self.mock_template_2.body = '{"key": "value"}'

        self.mock_query.return_value.all.return_value = [self.mock_template_1, self.mock_template_2]

        command = GetAllTemplates()
        templates = command.execute()

        self.mock_query.assert_called_once_with(Template)
        self.mock_query.return_value.all.assert_called_once()

        assert len(templates) == 2
        assert templates[0] == self.mock_template_1
        assert templates[1] == self.mock_template_2

    def test_get_all_templates_empty(self):
        self.mock_query.return_value.all.return_value = []

        command = GetAllTemplates()
        templates = command.execute()

        self.mock_query.assert_called_once_with(Template)
        self.mock_query.return_value.all.assert_called_once()

        assert templates == []

    def test_get_all_templates_database_error(self):
        self.mock_query.return_value.all.side_effect = Exception("Database error")

        with pytest.raises(Exception, match="Database error"):
            GetAllTemplates().execute()

        self.mock_query.assert_called_once_with(Template)
        self.mock_query.return_value.all.assert_called_once()
