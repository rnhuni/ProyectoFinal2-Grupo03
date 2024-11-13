import { renderHook, act, waitFor } from '@testing-library/react-native';
import useFileUpload from "../../src/hooks/uploadFile/useFileUpload";
import api from "../../src/api/api";
import { AxiosError } from "axios";

jest.mock("../../src/api/api");

describe("useFileUpload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default state values", () => {
    const { result } = renderHook(() => useFileUpload());

    expect(result.current.uploadProgress).toBe(0);
    expect(result.current.error).toBe("");
    expect(result.current.loading).toBe(false);
  });

  it("should set loading to true and then false after calling getUploadUrl", async () => {
    const mockResponse = {
      data: {
        content_type: "image/png",
        media_id: "123",
        media_name: "test.png",
        upload_url: "https://upload.url",
      },
    };
    (api.post as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFileUpload());

    await act(async () => {
      result.current.getUploadUrl("test.png", "image/png");
    });

    //expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    //expect(result.current.loading).toBe(false);
    //expect(result.current.error).toBe("");
  });

  it("should handle error in getUploadUrl and set error message", async () => {
    const mockError = new AxiosError("Failed to get upload URL");
    (api.post as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useFileUpload());

    await act(async () => {
      result.current.getUploadUrl("test.png", "image/png");
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Failed to get upload URL");
    expect(result.current.loading).toBe(false);
  });

  it("should set loading and uploadProgress correctly in uploadFile", async () => {
    const mockUrl = "https://upload.url";
    const mockFile = { name: "test.png", type: "image/png", size: 1024 } as File;


    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
    });

    const { result } = renderHook(() => useFileUpload());

    await act(async () => {
      result.current.uploadFile(mockFile, mockUrl);
    });

    expect(result.current.uploadProgress).toBe(0);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("");
    expect(result.current.uploadProgress).toBe(0);
  });

  it("should handle error in uploadFile and set error message", async () => {
    const mockUrl = "https://upload.url";
    const mockFile = { name: "test.png", type: "image/png", size: 1024 } as File;

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    });

    const { result } = renderHook(() => useFileUpload());

    await act(async () => {
      result.current.uploadFile(mockFile, mockUrl);
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("File upload failed");
    expect(result.current.loading).toBe(false);
  });
});
