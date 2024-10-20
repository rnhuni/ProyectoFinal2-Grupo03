import pytest
from unittest.mock import MagicMock
from ServicioSistema.commands.user_exists_by_email import ExistsUserByEmail
from ServicioSistema.models.user import User

@pytest.fixture
def mock_session(mocker):
    return mocker.patch('ServicioSistema.commands.user_exists_by_email.session')

def test_exists_user_by_email_found(mock_session):
    # Simular que el usuario existe
    mock_user = MagicMock(spec=User)
    mock_session.query.return_value.filter_by.return_value.first.return_value = mock_user

    exists = ExistsUserByEmail("testuser@example.com").execute()
    
    assert exists is True

def test_exists_user_by_email_not_found(mock_session):
    # Simular que el usuario no existe
    mock_session.query.return_value.filter_by.return_value.first.return_value = None

    exists = ExistsUserByEmail("testuser@example.com").execute()
    
    assert exists is False

def test_exists_user_by_email_invalid_email():
    with pytest.raises(ValueError, match="Email is required"):
        ExistsUserByEmail("").execute()

def test_exists_user_by_email_internal_error(mock_session):
    mock_session.query.side_effect = Exception("Internal Error")

    with pytest.raises(Exception, match="Internal Error"):
        ExistsUserByEmail("testuser@example.com").execute()
