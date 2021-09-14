import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Divider from '@material-ui/core/Divider';
import { forceLogout } from '../../../components/auth/auth';
import { isError } from 'util';
import styles from '../../../styles/Template.module.scss';
import Button from '@material-ui/core/Button';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {getRepoByNano} from '../../../service/repository.service'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { TextField } from '@material-ui/core';
import styles1 from '../../../styles/Home.module.scss';
import Image from 'next/image';


const ColorButton = withStyles(() => ({
	root: {
		color: '#faf7f7',
		backgroundColor: '#0a0a0a',
		'&:hover': {
			backgroundColor: '#544d4d',
        },
        padding: '5px 40px'
	},
}))(Button);

export const getServerSideProps = async (context) => {
	let isError = false;
	let cookie = null;
    let template = null;
	let tempId=null;
	let repoNano=null
	let repoId=null

	try {
		cookie = context?.req?.headers.cookie;
		tempId=context.params.slug[1]
		repoNano=context.params.slug[0]

		//fetch templates
		let result2 = await axios.get(`${process.env.API_URL}/template/getByNano/${tempId}`, {
			headers: {
				cookie: cookie!,
			},
		});
		console.log("test template response",result2)
		template = result2.data;
		
		//get repo by nano
		let repo=await getRepoByNano(repoNano);
		repoId=repo.id;
	} catch (error) {
		console.log(`error in template preview ${error}`);
		isError = true;
	}

	return {
		props: { isError, template,repoId },
	};
};

interface FormData {
	name: string;
}

 const html= `<h2><a href="https://blog.flocareer.com/author/mohit-jain"><span style="box-sizing: inherit; color: var(--secondary-text-color); font-style: normal; font-weight: 700;">Mohit Jain</span></a></h2><div><span>&nbsp;</span>Â·<span>&nbsp;</span><span style="box-sizing: inherit; color: var(--tertiary-text-color); font-size: 14px;">Mar 15, 2021</span><span>&nbsp;</span>Â·<span>&nbsp;</span><span style="box-sizing: inherit; color: var(--tertiary-text-color); font-size: 14px;">4 min read</span></div><div class="se-component se-image-container __se__float- __se__float-none" contenteditable="false"><figure style="margin: 0px;"><a href="https://www.facebook.com/sharer/sharer.php?u=https://blog.flocareer.com/should-your-business-use-digital-interviewing-ckmagq4b0002424xjs3wsicn4" rel="noopener noreferrer" alt="https://www.facebook.com/sharer/sharer.php?u=https://blog.flocareer.com/should-your-business-use-digital-interviewing-ckmagq4b0002424xjs3wsicn4" data-image-link="image"><img src="https://blog.flocareer.com/images/social/facebook.png" alt="share on facebook" data-image-link="https://www.facebook.com/sharer/sharer.php?u=https://blog.flocareer.com/should-your-business-use-digital-interviewing-ckmagq4b0002424xjs3wsicn4" data-proportion="true" data-align="none" data-file-name="facebook.png" data-file-size="0" data-origin="," data-size="," data-rotate="" data-percentage="auto,auto" origin-size="32,32" style="" data-index="0" data-rotatex="" data-rotatey=""></a></figure></div><div class="se-component se-image-container __se__float- __se__float-none" contenteditable="false"><figure style="margin: 0px;"><a href="https://twitter.com/intent/tweet?url=https://blog.flocareer.com/should-your-business-use-digital-interviewing-ckmagq4b0002424xjs3wsicn4" rel="noopener noreferrer" alt="https://twitter.com/intent/tweet?url=https://blog.flocareer.com/should-your-business-use-digital-interviewing-ckmagq4b0002424xjs3wsicn4" data-image-link="image"><img src="https://blog.flocareer.com/images/social/twitter.png" alt="share on twitter" data-image-link="https://twitter.com/intent/tweet?url=https://blog.flocareer.com/should-your-business-use-digital-interviewing-ckmagq4b0002424xjs3wsicn4" data-proportion="true" data-align="none" data-file-name="twitter.png" data-file-size="0" data-origin="," data-size="," data-rotate="" data-percentage="auto,auto" origin-size="32,32" style="" data-index="1" data-rotatex="" data-rotatey=""></a></figure></div><div class="se-component se-image-container __se__float- __se__float-none" contenteditable="false"><figure style="margin: 0px;"><a href="https://www.linkedin.com/shareArticle?mini=true&amp;url=https://blog.flocareer.com/should-your-business-use-digital-interviewing-ckmagq4b0002424xjs3wsicn4" rel="noopener noreferrer" alt="https://www.linkedin.com/shareArticle?mini=true&amp;url=https://blog.flocareer.com/should-your-business-use-digital-interviewing-ckmagq4b0002424xjs3wsicn4" data-image-link="image"><img src="https://blog.flocareer.com/images/social/linkedin.png" alt="share on linkedin" data-image-link="https://www.linkedin.com/shareArticle?mini=true&amp;url=https://blog.flocareer.com/should-your-business-use-digital-interviewing-ckmagq4b0002424xjs3wsicn4" data-proportion="true" data-align="none" data-file-name="linkedin.png" data-file-size="0" data-origin="," data-size="," data-rotate="" data-percentage="auto,auto" origin-size="32,32" style="" data-index="2" data-rotatex="" data-rotatey=""></a></figure></div><div class="se-component se-image-container __se__float- __se__float-none" contenteditable="false"><figure style="margin: 0px;"><a href="mailto:?&amp;subject=&amp;body=https://blog.flocareer.com/should-your-business-use-digital-interviewing-ckmagq4b0002424xjs3wsicn4" rel="noopener noreferrer" alt="mailto:?&amp;subject=&amp;body=https://blog.flocareer.com/should-your-business-use-digital-interviewing-ckmagq4b0002424xjs3wsicn4" data-image-link="image"><img src="https://blog.flocareer.com/images/social/email.png" alt="share on email" data-image-link="mailto:?&amp;subject=&amp;body=https://blog.flocareer.com/should-your-business-use-digital-interviewing-ckmagq4b0002424xjs3wsicn4" data-proportion="true" data-align="none" data-file-name="email.png" data-file-size="0" data-origin="," data-size="," data-rotate="" data-percentage="auto,auto" origin-size="32,32" style="" data-index="3" data-rotatex="" data-rotatey=""></a></figure></div><p><strong>Digital interviewing â€“ should your business implement it?</strong></p><p>One of the most common struggles faced by businesses and recruiters is getting candidates to appear for the initial interview. Oftentimes, the interviewee is either traveling or you do not want a huge crowd at your office premises. In this scenario, a digital or online interview is always the best option.</p><p><strong>What is a digital interview?</strong></p><p>As the name suggests, the interview is conducted online. While in a telephonic interview it becomes impossible to gauge nonverbal cues, a digital interview allows you to view the person while conducting the interview. This gives you the benefit of gauging the personâ€™s reaction to questions and lets you observe their body language. Moreover, with the help of a suitable and modern digital interviewing platform, you can even show presentations or videos about your company to the applicant. This will give them a better understanding about your business and the culture in your company.</p><p>All that is required to get your digital interview going is a stable internet connection and a robust digital interviewing platform. At FloCareer, we provide the best digital interviewing platform for your first line of interviews. Not just that, but our interview panel comes with extensive experience from the required domain, thus making our panel well equipped to assess your candidates.&nbsp;</p><p><strong>Will the position require client interaction?</strong></p><p>Working in an IT company does not only mean working behind a screen, cloistered in the office all day long. Communication is a critical skill for intra-team and inter-team collaboration. Depending on the role and its growth, a candidate may in the future have to interact with clients or perhaps even work on the client site. In these cases, a digital interview is one of the best ways to recruit candidates so as to gauge the applicantâ€™s adaptability to the role.&nbsp;</p><p><br></p><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="http://res.cloudinary.com/sanjayaalam/image/upload/v1629105925/C2/B41/lxt18bnuy4cduhgmlvhl.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="none" data-percentage="auto,auto" data-file-name="lxt18bnuy4cduhgmlvhl.jpg" data-file-size="0" data-origin="," origin-size="840,350" style="" data-index="4" data-rotatex="" data-rotatey=""></figure></div><p><strong>Testing/ Screening Assignments</strong>&nbsp;<br></p><p>If you have been taking interviews for a while now, then you have probably walked into an interview and realized right from the go that the candidate is not a right fit for the job. But then you canâ€™t just run through the interview in five minutes &amp; you end up dedicating about 20 to 30 minutes of your time to finish the interview. It doesnâ€™t have to necessarily be that way. Implementing digital interviews for the first round of screening, will save you and the candidate lots of time and will moreover prevent this scenario 9 out of 10 times. Even for the right set of candidates, you are saving their commute time when you opt for a digital interview as the first round. So when you actually allocate time for an in-face interview, if required, then you know that you are meeting the right candidate.&nbsp;</p><p>Also, FloCareer platform provides all the means and tools required to mimic an in-person interview. For instance, if you are hiring for the position of a developer, then you can assess candidatesâ€™ coding capabilities on FloCareer platform, which mimics the whiteboard session or pseudocode write up or coding for specific language.&nbsp;</p><p><strong>Why should you add this platform to your recruiting process?</strong></p><p>Acquiring the right talent from a pool of candidates flooding an already competitive market is difficult. Assessing their strengths, abilities, skills and differences is time consuming and requires a huge amount of effort and the demand for highly qualified candidates is on the rise â€“ continually. Hence, shortlisting the right candidates requires the use of better interview techniques that are more effective and efficient as compared to traditional methods of recruitment. Also, opting for a platform that is designed for interviews (as opposed to Zoom or Skype, for example) allows you to have better record keeping and helps you to be more data driven. All the questions asked during the interview, candidateâ€™s performance against them, actual code written by candidates, as well as the video of the candidate is recorded and available to you with just a few clicks.&nbsp;</p><p><strong>Conclusion</strong>&nbsp;</p><p>With the integration of a robust digital interviewing platform in your businessâ€™s hiring process, you can improve the efficiency of the screening process, be more data driven and get the right candidates after an effective first round of interview. Digital interviewing allows interaction on the same level as in-person interviews. It does not compromise on interview quality but rather enhances it. Moreover it saves time and huge amounts of money.</p><p><br></p><p><br></p>`


const TemplatePreview = ({isError,template,repoId})=>{
    const [temp, setTemp] = useState(template);
	useEffect(() => {
		if (isError) {
			return forceLogout();
		}
    }, []);
	console.log("test template",template)
	console.log("test repo id",repoId)

	let schema = yup.object().shape({
		name: yup.string().required().max(70),
	});

	const {
		register,
		watch,
		reset,
		getValues,
		handleSubmit,
		formState: { errors, isDirty, isValid },
	} = useForm<FormData>({ mode: 'onChange', resolver: yupResolver(schema) });

	const [serverErrors, setServerErrors] = useState<Array<string>>([]);
	const [error, setError] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		reset();
		setOpenDialog(false);
	};

    const addCustomTemp = (id) =>{
			console.log("test Process",id);
			handleOpenDialog();
	}
	
	const onSubmit = async (formData, event) => {
		const values = {
			templateId:temp.id,
			repoId:repoId,
			name: formData.name,
		};
		console.log("test submit data",values)

		setServerErrors([]);
		setError(false);

		const response = await axios.post(`/api/customTemp`, values);
		console.log("test response data --->",response)

		if (response.data.errors) {
			setServerErrors(response.data.errors);
			setError(true);
		}

		if (response.status === 201) {
			setOpenDialog(false);
			event.target.reset();
		}
	};


    return (
        <>
        <div className={styles.temp_wrap}>
				<div className={styles.left}>
                    <div style={{ padding: '20px' }}>Lead Capture - Template gallery </div>
                    <div style={{ marginTop: '5px' }}>
							<Divider />
				    </div>
					<div style={{ padding: '20px' }}>Use templates to quickly get started. Modern SEO ready templates for better conversion.</div>
                    <div style={{ marginTop: '5px' }}>
							<Divider />
					</div>

                    <div style={{ marginTop: '20px',textAlign: "center" }}>
                    <ColorButton onClick={()=> addCustomTemp(temp.id)} >Use This Template</ColorButton>
                    </div>
					
				</div>

				<div className={styles.right}>
					<div className={styles.dialog_pop} style={{ marginTop: '40px' }}>
						<div style={{ fontSize: '20px' }}>&emsp;</div>
						<div style={{ cursor: 'pointer', marginRight: '10px' }} onClick={(event) => Router.back()}>
							Back
						</div>
					</div>

					<div className={styles.title}>
						<div>Preview Lead capture Template</div>
						<div style={{ marginTop: '5px' }}>
							<Divider />
						</div>
					</div>

					<div className={styles.body}>
					<div dangerouslySetInnerHTML={{ __html: html }}></div>
					</div>
				</div>
			</div>


			<div>
			<Dialog open={openDialog} onClose={handleCloseDialog}>
					<DialogContent style={{ width: '500px' }}>
						<div className={styles1.dialog_pop}>
							<div style={{ fontSize: '20px' }}>&emsp;</div>
							<div style={{ cursor: 'pointer' }}>
								<Image src='/static/images/close.svg' alt='edit' width='16px' height='16px' onClick={handleCloseDialog} />
							</div>
						</div>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className={styles1.formGap}>
								<div className={styles1.text_wc_wrap}>
									<TextField
										type='text'
										label='Name your template'
										margin='dense'
										name='name'
										variant='standard'
										size='small'
										fullWidth
										{...register('name')}
										InputLabelProps={{
											style: { color: '#0a0a0a' },
										}}
										style={{ borderRadius: '50px' }}
										error={!!errors.name}
									/>
									
								</div>
								<div className='global_errors'>{errors && errors?.name?.message}</div>
							</div>

							<div className={styles1.action_btns}>
								<ColorButton
									type='submit'
								>
									Continue
								</ColorButton>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>
        </>

    );

}

export default TemplatePreview;