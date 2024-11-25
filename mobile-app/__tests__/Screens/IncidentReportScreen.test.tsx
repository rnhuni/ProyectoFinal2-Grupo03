import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../src/internalization/i18n';
import {NavigationContainer} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import {Alert} from 'react-native';
import {IncidentReportScreen} from '../../src/Presentation/Screens/Incidents/IncidentReportScreen';
import useFileUpload from '../../src/hooks/uploadFile/useFileUpload';
import useIncidents from '../../src/hooks/incidents/useIncidents';

jest.mock('aws-amplify', () => ({
  Amplify: {
    configure: jest.fn(),
  },
  API: {
    graphql: jest.fn(),
  },
  graphqlOperation: jest.fn(),
}));

jest.mock('react-native-config', () => ({
  API_URL: 'https://mock-api.example.com',
  OTHER_CONFIG: 'mock-value',

  AWS_APPSYNC_GRAPHQLENDPOINT: 'https://mock-api.example.com',
  AWS_APPSYNC_REGION: 'pepe',
  AWS_APPSYNC_AUTHENTICATIONTYPE: 'API_KEY',
  AWS_APPSYNC_APIKEY: 'da2-key',
}));

jest.mock('../../src/hooks/incidents/useIncidents');

jest.mock('react-native-document-picker', () => ({
  pick: jest.fn().mockResolvedValue([
    {
      uri: 'file://test/file',
      type: 'application/pdf',
      name: 'testfile.pdf',
    },
  ]),
  types: {
    allFiles: '*/*',
  },
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(), // Mockea useNavigation
}));

jest.mock('../../src/hooks/uploadFile/useFileUpload', () => ({
  __esModule: true,
  default: jest.fn(),
}));

global.File = class File {
  lastModified: number;
  name: string;
  webkitRelativePath: string;
  size: number;
  type: string;
  constructor(
    fileBits: BlobPart[],
    fileName: string,
    options: FilePropertyBag = {},
  ) {
    const blob = new Blob(fileBits, options);
    this.lastModified = options.lastModified || Date.now();
    this.name = fileName;
    this.webkitRelativePath = '';
    this.size = blob.size;
    this.type = options.type || '';
    Object.assign(this, blob);
  }
  arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(new ArrayBuffer(0));
  }
  slice(start?: number, end?: number, contentType?: string): Blob {
    return new Blob();
  }
  stream(): ReadableStream {
    return new ReadableStream();
  }
  text(): Promise<string> {
    return Promise.resolve('');
  }
};

jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

const renderWithI18n = (component: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>{component}</NavigationContainer>
    </I18nextProvider>,
  );
};

describe('IncidentReportScreen', () => {
  let uploadFileMock: jest.Mock<any, any, any>,
    getUploadUrlMock: jest.Mock<any, any, any>,
    createIncidentMock: jest.Mock<any, any, any>;

  beforeAll(() => {
    global.alert = jest.fn();
  });

  beforeEach(() => {
    uploadFileMock = jest.fn();
    getUploadUrlMock = jest.fn();
    (useFileUpload as jest.Mock).mockReturnValue({
      uploadFile: uploadFileMock,
      getUploadUrl: getUploadUrlMock,
      uploadProgress: 0,
      loading: false,
    });

    createIncidentMock = jest.fn();
    (useIncidents as jest.Mock).mockReturnValue({
      createIncident: createIncidentMock,
    });

    jest.clearAllMocks();
  });

  it('debería manejar el registro de un incidente con archivos adjuntos', async () => {
    const {getByTestId} = renderWithI18n(<IncidentReportScreen />);

    fireEvent.changeText(getByTestId('phone-number-input'), '3001012375');
    fireEvent.changeText(
      getByTestId('description-input'),
      'Incident description',
    );

    const mockAttachment = {
      fileObject: true,
      file_uri: 'path/to/file',
      file_name: 'file.pdf',
      content_type: 'application/pdf',
    };

    const mockUploadData = {
      media_id: 'media-id',
      media_name: 'pmedia-name',
      content_type: 'application/pdf',
      upload_url: 'upload-url',
    };

    fireEvent.press(getByTestId('file-upload-button'));
    await waitFor(() => {
      getUploadUrlMock.mockResolvedValue(mockUploadData);
      uploadFileMock.mockResolvedValue(true);
    });

    fireEvent.press(getByTestId('register-button'));
  });
});

describe('IncidentReportScreen', () => {
  const createIncidentMock = jest.fn();
  const reloadIncidentsMock = jest.fn();

  beforeAll(() => {
    global.alert = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useIncidents as jest.Mock).mockReturnValue({
      incidents: [],
      loading: false,
      error: '',
      createIncident: createIncidentMock,
      reloadIncidents: reloadIncidentsMock,
    });
  });

  it('debe cargar un archivo correctamente cuando el usuario selecciona un archivo', async () => {
    const {getByText, getByTestId} = renderWithI18n(<IncidentReportScreen />);
    fireEvent.press(getByTestId('file-upload-button'));
    await waitFor(() => expect(DocumentPicker.pick).toHaveBeenCalledTimes(1));
  });

  it('renders the screen with all elements', () => {
    const {getByTestId, getByText} = renderWithI18n(<IncidentReportScreen />);
    expect(getByTestId('incident-type-picker')).toBeTruthy();
    expect(getByTestId('phone-number-input')).toBeTruthy();
    expect(getByTestId('description-input')).toBeTruthy();
    expect(getByTestId('register-button')).toBeTruthy();
  });

  it('allows selecting an incident type', () => {
    const {getByTestId, getByText} = renderWithI18n(<IncidentReportScreen />);
    const picker = getByTestId('incident-type-picker');

    fireEvent(picker, 'onValueChange', 'Incidente 1');
  });

  it('updates the phone number input', () => {
    const {getByTestId} = renderWithI18n(<IncidentReportScreen />);
    const phoneInput = getByTestId('phone-number-input');

    fireEvent.changeText(phoneInput, '1234567890');
    expect(phoneInput.props.value).toBe('1234567890');
  });

  it('updates the description input', () => {
    const {getByTestId} = renderWithI18n(<IncidentReportScreen />);
    const descriptionInput = getByTestId('description-input');

    fireEvent.changeText(
      descriptionInput,
      'This is a test incident description',
    );
    expect(descriptionInput.props.value).toBe(
      'This is a test incident description',
    );
  });

  it('calls createIncident on register button press', async () => {
    const {getByTestId} = renderWithI18n(<IncidentReportScreen />);
    const registerButton = getByTestId('register-button');

    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(createIncidentMock).toHaveBeenCalledTimes(1);
    });
  });

  it('shows an error message when createIncident fails', async () => {
    const errorMessage = 'Error creating incident';
    createIncidentMock.mockRejectedValueOnce(new Error(errorMessage));
    const {getByTestId, findByText} = renderWithI18n(<IncidentReportScreen />);

    const registerButton = getByTestId('register-button');
    fireEvent.press(registerButton);
  });
});
