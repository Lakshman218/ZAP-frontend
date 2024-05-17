import React, { useEffect, useState } from 'react'
import { followUser, unFollowUser, getUserConnection, rejectFollowRequest } from '../../services/user/apiMethods';
import PostGallery from '../profile/postGallery';
import emptypost from '../../../public/images/userNoPost.jpg'
import { useSelector } from 'react-redux';

function UserDetails({user, connections, posts}) {
  const selectUser = (state) => state.auth.user;
  const userData = useSelector(selectUser);
  const userId = userData._id || ""
  const [isFollowed, setIsFollowed] = useState(false);
  const [isFollowRequested, setIsFollowRequested] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const followingUserId = user?._id
    getUserConnection({userId: followingUserId})
      .then((response) => {
        const connectionData = response.data.connection
        setFollowers(connectionData.followers)
        setFollowing(connectionData.following)
        setIsFollowed(connections.followers.include(userId))
        setIsFollowRequested(connections.requested.include(userId))
      })
      .catch((error) => {
        console.log(error.message);
      })
  },[])

  const handleFollow = () => {
    const followingUserId = user._id
    followUser({userId, followingUserId})
      .then((response) => {
        response.data.followed?
        setIsFollowed(true):
        setIsFollowRequested(true)
      })
      .catch((error) => {
        console.log(error.message);
      })
  }
  const handleUnFollow = () => {
    const followingUserId = user._id
    unFollowUser({userId, followingUserId})
      .then((response) => {
        console.log(response.data);
        setIsFollowed(false)
      })
      .catch((error) => {
        console.log(error.message);
      })
  }
  const handleReject = () => {
    const requestedUser = user._id
    rejectFollowRequest(userId, requestedUser) 
      .then((response) => {
        console.log(response.data);
        setIsFollowRequested(false)
      })
      .catch((error) => {
        console.log(error.message);
      })
  }

  return (
    <div className='w-full p-4 mr-2'>
      <div className='flex w-full justify-center mb-6'>
          <div className='flex bg-white w-full rounded-md shadow-md'>
            <div className='lg:flex lg:p-8 ml-4 justify-center gap-8'>
              <div className="flex lg:ml-8 justify-center">
                <img
                  className=" h-40 w-40 rounded-full"
                  src={user?.profileImg}
                  alt="Profile image"
                />
              </div>
              <div className='block ml-10'>
                <div className='font-semibold text-3xl pb-2'>{user.userName}</div>
                <div className='pb-0'>{user.name}</div>
                <div className='pb-1'>{user.bio}</div>
                <div className='flex justify-between  mt-2 cursor-pointer gap-10'>
                  <div className='flex flex-col cursor-pointer items-center'>
                    <p className="font-medium text-lg">{posts.length}</p>
                    <p className="text-sm">Posts</p>
                  </div>
                  <div className='flex flex-col cursor-pointer items-center'>
                    <p className="font-medium text-lg">{followers.length}</p>
                    <p className="text-sm">Followers</p>
                  </div>
                  <div className='flex flex-col cursor-pointer items-center'>
                    <p className="font-medium text-lg">{following.length}</p>
                    <p className="text-sm">Following</p>
                  </div>
                </div>  
              </div>
              <div className='flex lg:mt-0 mt-2'>
              <div>
                {isFollowed ? (
                <button 
                onClick={handleUnFollow}
                className='lg:bg-black lg:text-white lg:h-10 lg:w-28 py-2 px-4 rounded ml-10 items-center'>
                    UnFollow
                </button>
                ) : isFollowRequested ? (
                  <button 
                  onClick={handleReject}
                  className='lg:bg-black lg:text-white lg:h-10 lg:w-28 py-2 px-4 rounded ml-10 items-center'>
                    Requested
                </button>
                ) : (
                  <button 
                  onClick={handleFollow}
                  className='lg:bg-black lg:text-white lg:h-10 lg:w-28 py-2 px-4 rounded ml-10 items-center'>
                    Follow
                </button>
                )}
              </div>
              <div>
                <button className='lg:bg-black lg:text-white lg:h-10 lg:w-28 py-2 px-4 rounded ml-8 items-center'>
                  Message
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>

    
      {posts.length === 0? (
        <div className='flex flex-col justify-center items-center mt-0 left-10 fixed text-black w-full h-auto '>
          <p>Empty post</p>
          <img className='w-96' src={emptypost} alt="" />
        </div>
        ) : (
        <div className='w-full mt-5  rounded-md  bg-white'>
          <div className='flex justify-between px-10  gap-10 p-2 font-normal text-lg'>
            <div className='bg-white w-full text-center h-10 flex items-center justify-center rounded hover:shadow-md'>
              <button>Posts</button>
            </div>
            <div className='bg-white w-full text-center h-10 flex items-center justify-center rounded hover:shadow-md'>
              <button>Saved</button>
            </div>
          </div>
        
          <div className='grid grid-cols-2 md:grid-cols-3 gap-5 bg-white p-2'>
            {
              posts.map((post) => (
                <div key={post._id}>
                  <PostGallery post={post}/> 
                </div>
              ))
            }
          </div>
        </div>
      )}

    </div>
  )
}

export default UserDetails