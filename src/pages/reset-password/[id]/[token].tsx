import { TextField } from "@material-ui/core";
import { useForm } from 'react-hook-form';
import { Button } from '@material-ui/core';
import {getUserById} from '../../api/auth/common'
import axios from 'axios';

const jwt=require('jsonwebtoken')



export const getServerSideProps = async (context) => {
    console.log("test value---->",context.params)
    const {id,token}=context.params
    const user=await getUserById(id);
    var response=null
    if(user == null){
        response="User Not Found" ;
    }
    else{
        try{
            const secret=process.env.JWT_SECRET
            const user=jwt.verify(token,secret)
            response=user
        }catch(error){
                console.log("error--->",error.message);
        }
    }

	return {
		props: { test:response },
	};
};

const Token = ({test}) => {
    console.log("test response data",test)
    const {
		register,
		handleSubmit,
	} = useForm();
    const onSubmit = async (data) => {
        console.log("test tha data in reset page",data)
        const values={
            id:test.id,
            password:data.password,
            salt:test.salt
        }
        const response = await axios.post(`/api/auth/reset-password`, values);
        console.log("test response===>",response)
    }
	return (
		<>
			<div className='container-fluid'>
				<div className='row'>

                    <br/>
                    <br/>
                    <br/>
                <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
						type='text'
						label='New password'
						fullWidth
						margin='dense'
						name='password'
						autoComplete='off'
						{...register('password')}
					/>
                      <TextField
						type='text'
						label='Confirm Password'
						fullWidth
						margin='dense'
						name='password'
						autoComplete='off'
						{...register('password1')}
					/>
                    	<Button type='submit' variant='contained' color='primary'>
							Change
						</Button>

                     </form>
				</div>
			</div>

		</>
	);
};

export default Token;
