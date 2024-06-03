import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import colors from "assets/theme/base/colors";
import CardBg from "assets/images/CardBg.webp";

function MiniStatisticsCard({ bgColor, title, count, percentage, icon, direction }) {
  const { info } = colors;

  return (
    <Card
      sx={{
        padding: "17px",
        backgroundImage: `url(${CardBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        borderRadius: "12px",
      }}
    >
      <VuiBox display="flex" alignItems="center">
        <VuiBox flex={1}>
          <VuiTypography
            variant="caption"
            color={bgColor === "white" ? "text" : "white"}
            opacity={bgColor === "white" ? 1 : 0.7}
            textTransform="capitalize"
            fontWeight={title.fontWeight}
            mb={1}
          >
            {title.text}
          </VuiTypography>
          <VuiTypography variant="h4" fontWeight="bold" color="white">
            {count}
          </VuiTypography>
        </VuiBox>
        <VuiBox
          width="4rem"
          height="4rem"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="rgba(0, 0, 0, 0.2)"
          borderRadius="12px"
        >
          {icon.component}
        </VuiBox>
      </VuiBox>
    </Card>
  );
}

// Setting default values for the props of MiniStatisticsCard
MiniStatisticsCard.defaultProps = {
  bgColor: "white",
  title: {
    fontWeight: "medium",
    text: "",
  },
  percentage: {
    color: "success",
    text: "",
  },
  direction: "right",
};

// Typechecking props for the MiniStatisticsCard
MiniStatisticsCard.propTypes = {
  bgColor: PropTypes.oneOf([
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
  ]),
  title: PropTypes.shape({
    fontWeight: PropTypes.oneOf(["light", "regular", "medium", "bold"]),
    text: PropTypes.string,
  }),
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "white",
    ]),
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  icon: PropTypes.shape({
    color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
    component: PropTypes.node.isRequired,
  }).isRequired,
  direction: PropTypes.oneOf(["right", "left"]),
};

export default MiniStatisticsCard;
