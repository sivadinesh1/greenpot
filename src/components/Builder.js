import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import Hero from '../components/landing/Hero';
import HeroPage from '../components/landing/HeroPage';
import ContentPage from '../components/landing/Content';

const BuilderComponent = ({ keySet, data, mode, onHandleChange }) => {
	console.log('test request key values--->', keySet);
	console.log('test request values--->', data);

	const onHadle = (data, position, index, type) => {
		console.log('check stage ----->1', index);
		onHandleChange(data, position, index, type);
	};

	return (
		<>
			{mode === 'view' && (
				<div>
					{data?.map((section, index) => {
						console.log('check index value in builder component---->', index);
						let obj = section;
						switch (section.type) {
							case 'Header':
								if (obj.status === 'Active')
									return (
										<Header
											company={obj.items[0].value}
											blocks={obj.items[1].value}
											imageUrl={obj.items[2].value}
											backgroundImage={obj.items[3].value}
											key={index}
											index={index}
											onHadle={onHadle}
										/>
									);
							case 'Footer':
								if (obj.status === 'Active') return <Footer data={obj.items[0].value} key={index} onHadle={onHadle} index={index} />;
							case 'Hero':
								console.log('check hero page status--->', obj);
								if (obj.status === 'Active')
									return (
										<HeroPage
											title={obj.items[0].value}
											content={obj.items[1].value}
											backgroundImage={obj.items[2].value}
											key={index}
											index={index}
											onHadle={onHadle}
										/>
									);
							case 'Content':
								if (obj.status === 'Active')
									return (
										<ContentPage
											title={obj.items[0].value}
											content={obj.items[1].value}
											key={index}
											index={index}
											onHadle={onHadle}
										/>
									);
						}
					})}
					{/* <HeroPage /> */}
					{/* <ContentPage /> */}
				</div>
			)}

			{/* {mode === "edit" && <div>

        </div>} */}
		</>
	);
};

export default BuilderComponent;
