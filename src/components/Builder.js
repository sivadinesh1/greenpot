import Header from "../components/landing/Header";
import Footer from "../components/landing/Footer";

const BuilderComponent = ({keySet,data,mode}) =>{

    console.log("test request key values--->",keySet)
    console.log("test request values--->",data)
    console.log("test request values--->",mode)

    return (<>
   {mode === "view" && <div>
						{keySet?.map((key) => {
							let obj = null;
							switch (key) {
								case 'Header':
									obj = data.Header;
									if (obj.status === 'Active')
										return (
											<Header
												company={obj.content[0].value}
												content={obj.content[1].value}
												imageUrl={obj.content[2].value}
												backgroundImage={obj.content[3].value}
											/>
										);
								case 'Footer':
									obj = data['Footer'];
									if (obj.status === 'Active') return <Footer data={obj.content[0].value} />;
							}
						})}
    </div>}

    {/* {mode === "edit" && <div>

        </div>} */}
    </>);
}

export default BuilderComponent;