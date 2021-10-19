import Header from "../components/landing/Header";
import Footer from "../components/landing/Footer";
import Hero from '../components/landing/Hero'
import HeroPage from '../components/landing/HeroPage'
import ContentPage from '../components/landing/Content'



const BuilderComponent = ({ keySet, data, mode, onHandleChange }) => {

	console.log("test request key values--->", keySet)
	console.log("test request values--->", data)

	const onHadle = (data, position, key) => {
		console.log("check stage ----->1", data)
		onHandleChange(data, position, key);
	}

	return (<>
		{mode === "view" && <div>
			{keySet?.map((key, index) => {
				let obj = null;
				let d = key.toString().split("-")
				switch (d[0]) {
					case 'Header':
						obj = data.Header;
						if (obj.status === 'Active')
							return (
								<Header
									company={obj.blocks[0].value}
									blocks={obj.blocks[1].value}
									imageUrl={obj.blocks[2].value}
									backgroundImage={obj.blocks[3].value}
									key={index}
									onHadle={onHadle}
								/>
							);
					case 'Footer':
						obj = data['Footer'];
						if (obj.status === 'Active')
							return <Footer data={obj.blocks[0].value}
								key={index}
								onHadle={onHadle} />;
					case 'Hero':
						obj = data['Hero'];
						console.log("check hero page status--->", obj)
						if (obj.status === 'Active')
							return <HeroPage
								title={obj.blocks[0].value}
								content={obj.blocks[1].value}
								key={index}
								onHadle={onHadle} />;
					case 'Content':
						obj = data['Content'];
						if (obj.status === 'Active')
							return <ContentPage
								title={obj.blocks[0].value}
								content={obj.blocks[1].value}
								key={index}
								onHadle={onHadle} />;

				}
			})}
			{/* <HeroPage /> */}
			{/* <ContentPage /> */}
		</div>}

		{/* {mode === "edit" && <div>

        </div>} */}
	</>);
}

export default BuilderComponent;