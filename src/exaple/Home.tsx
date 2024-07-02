export default function Home() {
  return (
    <div className="m-auto w-10/12 h-5/6 flex flex-col items-center justify-center">
      <div className=" bg-sky-700 w-full h-full p-3 flex flex-col items-center justify-center">
        <h1 className="text-xl mb-4 text-white">Home Page</h1>
      </div>
      <h1 className="w-full text-black text-right">**Do not forget to put your own google map key and Id in .env file</h1>
    </div>
  );
}