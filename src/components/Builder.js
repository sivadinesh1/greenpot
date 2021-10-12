import Header from "../components/landing/Header";
import Footer from "../components/landing/Footer";

const BuilderComponent = ({ keySet, data, mode }) => {

	console.log("test request key values--->", keySet)
	console.log("test request values--->", data)
	console.log("test request values--->", mode)

	return (<>
		{mode === "view" && <div>
			{keySet?.map((key, index) => {
				let obj = null;
				switch (key) {
					case 'Header':
						obj = data.Header;
						if (obj.status === 'Active')
							return (
								<Header
									company={obj.blocks[0].value}
									content={obj.blocks[1].value}
									imageUrl={obj.blocks[2].value}
									backgroundImage={obj.blocks[3].value}
									key={index}
								/>
							);
					case 'Footer':
						obj = data['Footer'];
						if (obj.status === 'Active') return <Footer data={obj.blocks[0].value} key={index} />;
				}
			})}
		</div>}

		{/* {mode === "edit" && <div>

        </div>} */}
	</>);
}

export default BuilderComponent;