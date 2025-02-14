export default function Page({ params }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-6 bg-white shadow-lg rounded-xl">
                <h1 className="text-2xl font-bold text-gray-800">ID: {params.id}</h1>
            </div>
        </div>
    );
}
