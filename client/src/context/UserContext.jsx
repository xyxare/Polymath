import React, { useState } from "react";
import PropTypes from "prop-types";

const UserContext = React.createContext([{}, () => {}]);

const initialState = {};

const UserProvider = ({ children }) => {
	const [state, setState] = useState(initialState);

	return <UserContext.Provider value={[state, setState]}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };
