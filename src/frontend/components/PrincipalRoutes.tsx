//Router
import { useRoutes } from 'react-router-dom';
//Routes
import routes from '../../routes';

const PrincipalRoutes = () => {
	const element = useRoutes(routes);
	return element;
};

export default PrincipalRoutes;
