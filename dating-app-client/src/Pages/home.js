import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPeopleList } from '../Redux/actions/dataActions';
import UserCard from '../Component/UserCard/UserCard';
import UserSketleton from '../Component/UserSkeleton/UserSkeleton';
import LoadingUser from '../Component/LoadingUser/LoadingUser';
import EmptyCard from '../Component/EmptyCard/EmptyCard';
import Unauthorize from '../Component/Unauthorize/Unauthorize';
const Home = ({authenticated, dataLoading, userLoading, getPeopleList, peopleList, peopleItem}) => {
    useEffect(() => { 
        getPeopleList()
        // eslint-disable-next-line
    }, [])
    const HomPage = authenticated 
        ? ( userLoading 
            ? ( dataLoading 
                ? (<UserSketleton/>)
                : (<LoadingUser/>)
            )
            : (
                dataLoading 
                ? (<UserSketleton/>)
                : ( peopleList.length > 0 ? <UserCard person={peopleItem}/> : <EmptyCard/>)
            )
        ) 
        : ( userLoading 
            ? ( dataLoading 
                ? (<UserSketleton/>)
                : (<LoadingUser/>)
            )
            : (<Unauthorize/>)
        ) 
    return HomPage;    
}


Home.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    dataLoading: PropTypes.bool.isRequired,
    userLoading: PropTypes.bool.isRequired,
    getPeopleList: PropTypes.func.isRequired,
    peopleList: PropTypes.array.isRequired,
    peopleItem: PropTypes.object
}

const mapStateToProps = state => ({
    authenticated: state.user.authenticated,
    userLoading: state.user.loading,
    dataLoading: state.data.loading,
    peopleItem: state.data.peopleItem,
    peopleList: state.data.peopleList
})

export default connect(mapStateToProps, { getPeopleList })(Home);