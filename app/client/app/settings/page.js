import ProtectedRoute from "../protectedRoute/page";

export default function Settings(){
    return (
        <>
        <ProtectedRoute>
            <div>
                <h1>settings page</h1>
            </div>
        </ProtectedRoute>
        </>
    );
}