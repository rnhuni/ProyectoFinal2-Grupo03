import { useProfileContext } from "../../contexts/ProfileContext";

const ReportIframe = () => {
  const { language, profile } = useProfileContext();
  console.log(profile);

  const reportUrl =
    language === "en" ? profile?.dashboard_url : profile?.dashboard_url_es;

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
