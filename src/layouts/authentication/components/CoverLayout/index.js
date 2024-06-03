import PropTypes from "prop-types";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import PageLayout from "examples/LayoutContainers/PageLayout";
import tripleLinearGradient from "assets/theme/functions/tripleLinearGradient";
import colors from "assets/theme/base/colors";
import BackImg from "assets/images/BackIm.webp"
function CoverLayout({
                       color,
                       header,
                       title,
                       description,
                       motto,
                       premotto,
                       image,
                       top,
                       cardContent,
                       children,
                     }) {
  const { gradients } = colors;

  return (
    <PageLayout
      background={tripleLinearGradient(
        gradients.cover.main,
        gradients.cover.state,
        gradients.cover.stateSecondary,
        gradients.cover.angle
      )}
    >
      <VuiBox
        height="100%"
        width="100vw"
        display={{ xs: "none", md: "flex" }} // Скрываем на мобильных устройствах
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        position="relative"
        top={0}
        zIndex={0}
      >
        <VuiBox
          sx={{
            width: "100%",
            maxWidth: "1200px",
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            mt: 4,
            p: 3,
            minHeight: "50vh",
          }}
        >
          <VuiTypography
            variant="h3"
            color="white"
            fontWeight="bold"
            textAlign="center"
            mb={2}
          >
            {premotto}
          </VuiTypography>
          <VuiTypography
            variant="h1"
            color="white"
            fontWeight="bold"
            textAlign="center"
            mb={2}
          >
            {title}
          </VuiTypography>
          <VuiTypography
            variant="body2"
            color="white"
            textAlign="center"
            mb={4}
          >
            {motto}
          </VuiTypography>
        </VuiBox>

        <VuiBox
          sx={{
            mt: -10,
            width: "80%",
            maxWidth: "600px",
            borderRadius: "15px",
            p: 0,
            transform: "translateX(12%)",
          }}
        >
          {children}
        </VuiBox>
      </VuiBox>
    </PageLayout>
  );
}

CoverLayout.defaultProps = {
  header: "",
  title: "",
  description: "",
  color: "info",
  top: 20,
};

CoverLayout.propTypes = {
  header: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string.isRequired,
  top: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export default CoverLayout;
