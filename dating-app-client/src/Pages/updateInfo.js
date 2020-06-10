import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ImageCollectionContainer from '../Component/ImageCollection/ImgCollectionContainer/ImgCollectionContainer';
//MUI
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import themeFile from '../Util/theme';
//Redux
import { connect } from 'react-redux';
import { editUserDetails, uploadImage, uploadCollection} from '../Redux/actions/userActions';
import MyBtn from '../Util/MyBtn';
import MyLoading from '../Util/MyLoading';
const styles = themeFile;

class updateInfo extends Component {
    constructor(){
        super();
        this.state = {
            bio: "", 
            location: "",
            birth: 2000,
            favorite: ""
        }
    }
    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = e => {
        e.preventDefault();
        const userDetails = {
            bio: this.state.bio,
            location: this.state.location,
            birth: this.state.birth,
            favorite: this.state.favorite
        }
        this.setState({loadingState: true})
        this.props.editUserDetails(userDetails);
    }
    openAvatarInput = () => {
        document.getElementById('avatarInput').click()
    }
    handleAvatarChange = e => {
        const avatarImage = e.target.files[0];
        const formData = new FormData();
        if(avatarImage.name) {
            formData.append('image', avatarImage, avatarImage.name)
            this.props.uploadImage(formData);
        }
    }
    openCollectionInput = () => {
        document.getElementById('collectionInput').click()
    }
    handleCollectionUpload = e => {
        const collectionImage = e.target.files[0];
        const formData = new FormData();
        formData.append('image', collectionImage, collectionImage.name)
        this.props.uploadCollection(formData);
    }
    componentDidMount(){
        this.setState({
            bio: this.props.user.bio,
            location: this.props.user.location,
            birth: Number(this.props.user.birth),
            favorite: this.props.user.favorite
        })
    }
    render(){
        const {classes, loadingState} = this.props;
        const {user: {imageCollection}} = this.props;
        return(
            <Grid container className={classes.form} spacing={10}>
                <Grid item sm>
                    <Typography variant='h2' className={classes.pageTitle}>Update your information</Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField 
                            id='email' 
                            name='bio' 
                            type='text' 
                            label='Bio' 
                            className={classes.textField} 
                            value={this.state.bio} 
                            onChange={this.handleChange} 
                            fullWidth
                        />
                        <TextField 
                            id='location' 
                            name='location' 
                            type='text' 
                            label='Location' 
                            className={classes.textField} 
                            value={this.state.location} 
                            onChange={this.handleChange} 
                            fullWidth
                        />
                         <TextField
                            id="date"
                            label="Year of birth"
                            type="number"
                            name="birth"
                            defaultValue={new Date().getFullYear() - 18}
                            value={this.state.birth}
                            className={classes.textField}
                            onChange={this.handleChange} 
                            InputLabelProps={{
                                shrink: true,
                            }}
                            min={1900}
                            max={new Date().getFullYear()}
                            fullWidth
                        />
                        <TextField 
                            id='favorite' 
                            name='favorite' 
                            type='text' 
                            label='favorite' 
                            className={classes.textField} 
                            value={this.state.favorite} 
                            onChange={this.handleChange} 
                            fullWidth
                        />
                        <Button type="submit" variant="outlined" color="primary" disabled={loadingState}>
                            Upload
                            {loadingState && (
                                <CircularProgress size={20} className={classes.progress}/>
                            )}
                        </Button>
                        <MyLoading isOpen={loadingState} message="Loading..."/>
                        <br/>
                        <small>Dont have an account ? Sign up <Link to='/signup'>here</Link></small>
                    </form>
                </Grid>
                <Grid item sm>
                    <Paper sm={12} elevation={2} variant="outlined" className={classes.textFieldEditForm}>
                        <Typography variant="h6">Avatar</Typography>
                        <input type="file" id="avatarInput" hidden="hidden" onChange={this.handleAvatarChange}/>
                        <MyBtn tip="Change your avatar" onClick={this.openAvatarInput}>
                            <AccountCircleIcon/>
                        </MyBtn>
                    </Paper>

                    <img src={this.props.user.imageUrl} alt="avatar" className={classes.avatar}/>
                    
                    <Paper sm={12} elevation={2} variant="outlined" className={classes.textFieldEditForm}>
                        <Typography variant="h6">Image collection</Typography>
                        <input type="file" id="collectionInput" hidden="hidden" onChange={this.handleCollectionUpload}/>
                        <MyBtn tip="Upload image to your collection" onClick={this.openCollectionInput}>
                            <AddCircleOutlineIcon/>
                        </MyBtn>
                    </Paper>
                    <ImageCollectionContainer collection={imageCollection}/>
                </Grid>
            </Grid>
        )
    }
}

updateInfo.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object,
    editUserDetails: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,
    uploadCollection: PropTypes.func.isRequired,
    imageCollection: PropTypes.array
}

const mapStateToProps = state => ({
    user: state.user.credentials,
    loadingState: state.user.loading
})
export default connect(mapStateToProps, { editUserDetails, uploadImage, uploadCollection })(withStyles(styles)(updateInfo))