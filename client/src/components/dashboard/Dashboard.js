import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getCurrentProfile } from "../../actions/profile";

// const Dashboard = () => {
//   return <div>test</div>;
// };

const Dashboard = ({ getCurrentProfile, auth, profile }) => {
  //   useEffect(() => {
  //     getCurrentProfile();
  //   }, [getCurrentProfile]);

  return (
    <div>
      Dashboard dsfsdjfsdlkfjkl
      <code>
        <pre>{JSON.stringify(getCurrentProfile, 2, null)}</pre>
      </code>
    </div>
  );
};

// Dashboard.propTypes = {
//   getCurrentProfile: PropTypes.func.isRequired,
//   auth: PropTypes.object.isRequired,
//   profile: PropTypes.object.isRequired,
// };
const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, getCurrentProfile)(Dashboard);
