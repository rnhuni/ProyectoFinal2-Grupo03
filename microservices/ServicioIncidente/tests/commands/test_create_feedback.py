import pytest
from unittest.mock import MagicMock
from ServicioIncidente.models.model import session
from ServicioIncidente.models.feedback import Feedback
from ServicioIncidente.commands.feedback_create import CreateFeedback

class TestCreateFeedback:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')
  
    def test_create_feedback_success(self):
        test_data = {
            "user_id": "user-1",
            "incident_id": "incident-1",
            "support_rating": 5,
            "ease_of_contact": 4,
            "resolution_time": 3,
            "support_staff_attitude": 5,
            "additional_comments": "Great support"
        }

        feedback_created = CreateFeedback(**test_data).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_called_once()
        assert isinstance(feedback_created, Feedback)
        assert feedback_created.user_id == test_data['user_id']
        assert feedback_created.incident_id == test_data['incident_id']
        assert feedback_created.support_rating == test_data['support_rating']
        assert feedback_created.ease_of_contact == test_data['ease_of_contact']
        assert feedback_created.resolution_time == test_data['resolution_time']
        assert feedback_created.support_staff_attitude == test_data['support_staff_attitude']
        assert feedback_created.additional_comments == test_data['additional_comments']
    
    def test_create_feedback_failure_on_commit(self, mocker):
        test_data = {
            "user_id": "user-2",
            "incident_id": "incident-2",
            "support_rating": 4,
            "ease_of_contact": 3,
            "resolution_time": 5,
            "support_staff_attitude": 3,
            "additional_comments": "Good service"
        }
        self.mock_commit.side_effect = Exception("Commit failed")

        with pytest.raises(Exception, match="Commit failed"):
            CreateFeedback(**test_data).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_called_once()
        self.mock_rollback.assert_called_once()

    def test_create_feedback_invalid_data(self):
        invalid_data = {
            "user_id": None,
            "incident_id": "incident-3",
            "support_rating": 5,
            "ease_of_contact": None,
            "resolution_time": 4,
            "support_staff_attitude": 5,
            "additional_comments": "Invalid feedback"
        }

        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateFeedback(**invalid_data).execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()
