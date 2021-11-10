import Header from './library/Header';
import Footer from './library/Footer';
import Hero from './library/Hero';
import HeroPage from './library/HeroPage';
import ContentPage from './library/Content';
import SubscriptionForm from '../components/subscription'

const BuilderComponent = ({ data, mode, onHandleChange = null }) => {

	const onHandle = (data, position, index, type) => {
		debugger
		onHandleChange(data, position, index, type);
	};

	return (
		<>
			{mode === 'edit' && (
				<div>
					{data?.map((section, index) => {
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
											cta_button={{ label: obj.items[3].formDetail.label, value: obj.items[3].value, style: obj.items[3].style }}
											mode={mode}
										/>
									);
							case 'Subscription':
								if (obj.status === 'Active')
									return (
										<SubscriptionForm
											title={{ value: obj.items[0].value, style: obj.items[0].style }}
											subTitle={{ value: obj.items[1].value, style: obj.items[1].style }}
											logo={obj.items[2].value}
											buttonLabel={obj.items[3].value}
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
											cta_button={{ label: obj.items[2].formDetail.label, value: obj.items[2].value, style: obj.items[2].style }}
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
								if (obj.status === 'Active')
									return (
										<HeroPage
											title={{ value: obj.items[0].value, style: obj.items[0].style }}
											content={{ value: obj.items[1].value, style: obj.items[1].style }}
											backgroundImage={obj.items[2].value}
											key={index}
											index={index}
											style={obj.sectionStyle}
											cta_button={{ label: obj.items[3].formDetail.label, value: obj.items[3].value, style: obj.items[3].style }}

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
											cta_button={{ label: obj.items[2].formDetail.label, value: obj.items[2].value, style: obj.items[2].style }}

										/>
									);
							case 'Subscription':
								if (obj.status === 'Active')
									return (
										<SubscriptionForm
											title={{ value: obj.items[0].value, style: obj.items[0].style }}
											subTitle={{ value: obj.items[1].value, style: obj.items[1].style }}
											logo={obj.items[2].value}
											key={index}
											index={index}
											style={obj.sectionStyle}
											mode={mode}
											buttonLabel={obj.items[3].value}
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
