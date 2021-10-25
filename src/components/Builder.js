import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import Hero from '../components/landing/Hero';
import HeroPage from '../components/landing/HeroPage';
import ContentPage from '../components/landing/Content';

const BuilderComponent = ({ data, mode, onHandleChange = null }) => {
	console.log('test request values--->', data);

	const onHandle = (data, position, index, type) => {
		debugger
		console.log('check stage ----->1', index);
		onHandleChange(data, position, index, type);
	};

	return (
		<>
			{mode === 'edit' && (
				<div>
					{data?.map((section, index) => {
						console.log('check index value in builder component---->', index);
						let obj = section;
						switch (section.type) {
							case 'Header':
								if (obj.status === 'Active')
									return (
										<Header
											company={{ value: obj.items[0].value, style: obj.items[0].style }}
											blocks={{ value: obj.items[1].value, style: obj.items[1].style }}
											imageUrl={obj.items[2].value}
											backgroundImage={obj.items[3].value}
											key={index}
											index={index}
											onHandle={onHandle}
											style={obj.sectionStyle}
											mode={mode}

										/>
									);
							case 'Footer':
								if (obj.status === 'Active') return (<Footer
									data={{ value: obj.items[0].value, style: obj.items[0].style }}
									key={index}
									onHandle={onHandle}
									index={index}
									style={obj.sectionStyle}
									mode={mode}

								/>);
							case 'Hero':
								console.log('check hero page status--->', obj);
								if (obj.status === 'Active')
									return (
										<HeroPage
											title={{ value: obj.items[0].value, style: obj.items[0].style }}
											content={{ value: obj.items[1].value, style: obj.items[1].style }}
											backgroundImage={obj.items[2].value}
											key={index}
											index={index}
											onHandle={onHandle}
											style={obj.sectionStyle}
											mode={mode}
										/>
									);
							case 'Content':
								if (obj.status === 'Active')
									return (
										<ContentPage
											title={{ value: obj.items[0].value, style: obj.items[0].style }}
											content={{ value: obj.items[1].value, style: obj.items[1].style }}
											key={index}
											index={index}
											onHandle={onHandle}
											style={obj.sectionStyle}
											mode={mode}

										/>
									);
						}
					})}
				</div>
			)}

			{mode === "view" &&
				<div>
					{data?.map((section, index) => {
						console.log('check index value in view mode---->', index);
						let obj = section;
						switch (section.type) {
							case 'Header':
								if (obj.status === 'Active')
									return (
										<Header
											company={{ value: obj.items[0].value, style: obj.items[0].style }}
											blocks={{ value: obj.items[1].value, style: obj.items[1].style }}
											imageUrl={obj.items[2].value}
											backgroundImage={obj.items[3].value}
											key={index}
											index={index}
											style={obj.sectionStyle}
										/>
									);
							case 'Footer':
								if (obj.status === 'Active') return (<Footer
									data={{ value: obj.items[0].value, style: obj.items[0].style }}
									key={index}
									index={index}
									style={obj.sectionStyle}
								/>);
							case 'Hero':
								console.log('check hero page status--->', obj);
								if (obj.status === 'Active')
									return (
										<HeroPage
											title={{ value: obj.items[0].value, style: obj.items[0].style }}
											content={{ value: obj.items[1].value, style: obj.items[1].style }}
											backgroundImage={obj.items[2].value}
											key={index}
											index={index}
											style={obj.sectionStyle}
										/>
									);
							case 'Content':
								if (obj.status === 'Active')
									return (
										<ContentPage
											title={{ value: obj.items[0].value, style: obj.items[0].style }}
											content={{ value: obj.items[1].value, style: obj.items[1].style }}
											key={index}
											index={index}
											style={obj.sectionStyle}
										/>
									);
						}
					})}
				</div>
			}
		</>
	);
};

export default BuilderComponent;
