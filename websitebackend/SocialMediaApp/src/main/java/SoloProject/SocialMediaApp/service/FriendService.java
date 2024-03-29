package SoloProject.SocialMediaApp.service;

import SoloProject.SocialMediaApp.models.AppUser;
import SoloProject.SocialMediaApp.models.AppUserDTO;
import SoloProject.SocialMediaApp.repository.AppUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class FriendService {
    private final AppUserRepository repository;

    public FriendService(AppUserRepository repository) {
        this.repository = repository;
    }

    public ResponseEntity<AppUser> removeFriend(Long userId, String friendUsername) {
        AppUser user = repository.findByAppUserID(userId);
        AppUser friend = repository.findByUsername(friendUsername);

        if (user != null && friend != null) {
            user.getFriends().remove(friend.getAppUserID());
            user.setFriendCount(user.getFriendCount() - 1);

            friend.getFriends().remove(userId);
            friend.setFriendCount(friend.getFriendCount() - 1);

            repository.save(user);
            repository.save(friend);

            return new ResponseEntity<>(user, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


    public ResponseEntity<List<Long>> getFriends(Long userId) {
        AppUser appUser = repository.findByAppUserID(userId);
        if(appUser != null){
            return ResponseEntity.ok(appUser.getFriends());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<AppUser> getFriend(Long userId, Long friendId) {
        AppUser appUser = repository.findByAppUserID(userId);
        if(appUser != null){
           List<Long> friends = appUser.getFriends();
            //check the user's friendlist.
           for(Long friend : friends) {
               if (friend == friendId) {
                   AppUser returnfriend = repository.findByAppUserID(friend);
                   return ResponseEntity.ok(returnfriend);
               }
           }
        }
        return ResponseEntity.notFound().build();
    }


    public ResponseEntity<AppUser> getFriend(Long userId, String friendUsername) {
        AppUser user = repository.findByAppUserID(userId);
        for (Long friend : user.getFriends()) {
            if (repository.findByAppUserID(friend).getUsername().equals(friendUsername)) {
                return ResponseEntity.ok(repository.findByUsername(friendUsername));
            }
        }
        return ResponseEntity.notFound().build();
    }











//    public ResponseEntity<List<AppUserDTO>> getAllFriendsDTOS(Long UserId) {
//        AppUser user = repository.findByAppUserID(UserId);
//        if (user != null && user.getFriends() != null) {
//            List<Long> friends = user.getFriends();
//            List<UserDTO> DTOList = convertToDTOList(friends);
//            return ResponseEntity.ok(DTOList);
//        }
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//    }

//    private List<UserDTO> convertToDTOList(List<Long> ids) {
//        List<UserDTO> result = new ArrayList<>();
//        if (ids != null) {
//            for (long id : ids) {
//                result.add(convertToDTO(id));
//            }
//        }
//        return result;
//    }

    private AppUserDTO convertToDTO(Long id) {
        AppUser user = repository.findByAppUserID(id);
        if (user != null) {
            return new AppUserDTO(
                    user);
        }
        return null;
    }


    public ResponseEntity<List<Long>> getAllFriendsIDS(Long userId) {
        AppUser user = repository.findByAppUserID(userId);
        if(user == null) {
            return ResponseEntity.notFound().build();
        }else {
            return ResponseEntity.ok(user.getFriends());
        }
    }


    public ResponseEntity<List<AppUser>> getAllFriendsAppUsers(Long userId) {
        AppUser user = repository.findByAppUserID(userId);


        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        List<AppUser> friends = new ArrayList<>();
        for (Long friendId : user.getFriends()) {
            AppUser friend = repository.findByAppUserID(friendId);
            friends.add(friend);
        }

        return ResponseEntity.ok(friends);
    }
}
