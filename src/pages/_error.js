function Error({ statusCode }) {
	return <p>{statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on client'}</p>;
}

Error.getInitialProps = ({ res, err }) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	return { statusCode };
};

export default Error;

// https://blog.logrocket.com/testing-and-error-handling-patterns-in-next-js/

// const data = await fetch("http://localhost:3000/api/books");
//   const errorCode = data.ok ? false : data.statusCode;
//   if (errorCode) {
//     res.statusCode = errorCode;
//   }
//   const json = await data.json();

//   return {
//     props: { errorCode, books: json.books_count },
//   };
// }

// export default function Page({ errorCode, books }) {
//   if (errorCode) {
//     return <Error statusCode={errorCode} />;
//   }
// }
