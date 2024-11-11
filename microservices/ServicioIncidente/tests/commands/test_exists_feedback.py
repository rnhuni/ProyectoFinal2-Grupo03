import pytest
from unittest.mock import MagicMock
from ServicioIncidente.models.model import session
from ServicioIncidente.models.feedback import Feedback
from ServicioIncidente.commands.feedback_exists import ExistsFeedback

class TestExistsFeedback:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
  
    def test_exists_feedback_true(self):
        mock_feedback = MagicMock()
        self.mock_query.return_value.filter_by.return_value.first.return_value = mock_feedback

        exists = ExistsFeedback("incident-1").execute()

        self.mock_query.assert_called_once_with(Feedback)
        assert exists is True

    def test_exists_feedback_false(self):
        self.mock_query.return_value.filter_by.return_value.first.return_value = None

        exists = ExistsFeedback("incident-2").execute()

        self.mock_query.assert_called_once_with(Feedback)
        assert exists is False

    def test_exists_feedback_invalid_data(self):
        with pytest.raises(ValueError, match="Feedback ID is required"):
            ExistsFeedback(None).execute()

        self.mock_query.assert_not_called()
