export default function Home() {
  return (
    <div className="m-auto w-10/12 h-5/6 flex flex-col items-center justify-center">
      <div className=" bg-sky-700 w-full h-full p-3 flex flex-col items-center justify-center">
        <h1 className="text-xl mb-4 text-white">Home Page</h1>
        <div className="bg-white p-6 rounded-md shadow-md text-black w-full max-w-2xl">
          <h2 className="text-2xl mb-4 text-center font-semibold">Welcome to the Google Maps API with React Example!</h2>
          <p className="mb-2">
            Explore features of Google Maps API and learn how to integrate it seamlessly with React. In this tutorial, I maked the examples for you on how to display maps, create search boxes, place markers, implement clustering, and enable navigation.
          </p>
          <p className="mb-2">
            Whether you're a beginner or looking to enhance your skills, this tutorial will provide you with the tools and knowledge to create dynamic and interactive maps for your web applications.
          </p>
          <p className="mb-2">
            For this learning, it is recommended to view the source code along with trying it out.
          </p>
          <p className="text-center font-semibold mb-4">
            Let's get started and map out your success!
          </p>
          <p className="text-right italic">- Sattapoom Tulyasuk</p>
        </div>
      </div>
      <h1 className="w-full text-black text-right">**Do not forget to put your own google map key and Id in .env file</h1>
    </div>
  );
}