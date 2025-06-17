	package com.example.demo.service.admin;
	
	import java.util.List;
	import java.util.Optional;
	
	import com.example.demo.model.dto.AdminGetSellerResponse;
	import com.example.demo.model.dto.UserDto;
	import com.example.demo.model.entity.User;
	
	public interface AdminUserService {
	
	    /**
	     * 登入驗證使用者名稱（可擴充為支援 email）
	     */
	    Optional<User> checkUser(String username);
	
	    /**
	     * 登入成功處理，生成 UserDto 並更新最近登入時間
	     */
	    UserDto handleSuccessfulLogin(User user);
	
	    /**
	     * 查詢所有賣家資訊（給後台管理員用）
	     */
	    List<AdminGetSellerResponse> findAllSellers();
	
	    /**
	     * 查詢所有使用者清單（含買家與賣家）
	     */
	    List<UserDto> findAllUsers();
	
	    /**
	     * 更新使用者狀態（啟用或停用）
	     * 
	     * @param userId 使用者 ID
	     * @param isActive true 為啟用，false 為停用
	     * @return 是否更新成功
	     */
	    boolean updateUserStatus(Long userId, boolean isActive);
	
	    /**
	     * 刪除使用者（軟刪或硬刪，視實作而定）
	     * 
	     * @param userId 使用者 ID
	     * @return 是否刪除成功
	     */
	    boolean deleteUserById(Long userId);
	
	    /**
	     * 重設使用者密碼
	     * 
	     * @param userId 使用者 ID
	     * @param newPassword 新密碼
	     * @return 是否成功
	     */
	    
		boolean resetUserPassword(Long userId, String newPassword);
		
	

	    /**
	     * 更新使用者角色
	     * 
	     * @param userId 使用者 ID
	     * @param newRoleId 新角色 ID
	     * @return 是否成功
	     */
	    boolean updateUserRole(Long userId, Integer newRoleId);
	}
