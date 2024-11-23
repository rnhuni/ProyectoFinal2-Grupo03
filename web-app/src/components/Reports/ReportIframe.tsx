import { useProfileContext } from "../../contexts/ProfileContext";

const ReportIframe = () => {
  const { language } = useProfileContext();
  //https://lookerstudio.google.com/embed/reporting/242040ec-2c30-4fd7-9f17-7ea2ed3a93f3/page/FGYTE
  const reportUrl =
    language === "en"
      ? "https://lookerstudio.google.com/embed/reporting/dashboard_url_en"
      : "https://lookerstudio.google.com/embed/reporting/dashboard_url_es";

  return (
    <iframe
      src={reportUrl}
      frameBorder="0"
      style={{
        width: "100%",
        height: "100%",
        border: 0,
      }}
      allowFullScreen
      sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      title="Google Looker Studio Report"
    ></iframe>
  );
};

export default ReportIframe;
