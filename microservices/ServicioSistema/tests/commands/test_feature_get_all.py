
import pytest
from unittest.mock import MagicMock, patch
from ServicioSistema.commands.features_get_all import GetAllFeatures
from ServicioSistema.models.feature import Feature
from ServicioSistema.models.model import session

class TestGetAllFeatures:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')

    def test_get_all_features_success(self, mocker):
        mock_feature_1 = MagicMock(spec=Feature)
        mock_feature_1.id = "feature-1"
        mock_feature_1.name = "Feature 1"

        mock_feature_2 = MagicMock(spec=Feature)
        mock_feature_2.id = "feature-2"
        mock_feature_2.name = "Feature 2"

        self.mock_query.return_value.all.return_value = [mock_feature_1, mock_feature_2]

        command = GetAllFeatures()
        features = command.execute()

        assert len(features) == 2
        assert features[0].id == "feature-1"
        assert features[1].id == "feature-2"
        self.mock_query.return_value.all.assert_called_once()

    def test_get_all_features_empty(self, mocker):
        self.mock_query.return_value.all.return_value = []

        command = GetAllFeatures()
        features = command.execute()

        assert features == []
        self.mock_query.return_value.all.assert_called_once()
