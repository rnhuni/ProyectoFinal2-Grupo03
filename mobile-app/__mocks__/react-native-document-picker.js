import { DocumentPickerResponse } from 'react-native-document-picker';

const pick = jest.fn().mockResolvedValue([
  {
    uri: 'file:///path/to/file',
    name: 'test-file.txt',
    type: 'text/plain',
  },
]);

const isCancel = jest.fn().mockReturnValue(false);

export default {
  pick,
  isCancel,
};
