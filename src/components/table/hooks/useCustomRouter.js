const { useNavigate, useLocation } = require("react-router");

const useCustomRouter = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return {
        replace: (searchParams) => {
            navigate(`${searchParams}`, { replace: true });
        },
        push: (searchParams) => {
            navigate(`${searchParams}`);
        },
        // Add more methods as needed
    };
};

export default useCustomRouter;
