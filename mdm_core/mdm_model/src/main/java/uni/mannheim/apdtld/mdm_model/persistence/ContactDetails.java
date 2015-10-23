package uni.mannheim.apdtld.mdm_model.persistence;

import java.io.Serializable;

import javax.persistence.Embeddable;

/**
 * Embedded ContactDetails.
 * 
 * @author APDTLD_MDM @ Uni Mannheim
 * @version 23.10.2015
 */
@Embeddable
public class ContactDetails implements Serializable {
	
	// constants
	private static final long serialVersionUID = 1L;
	
	// attributes
	private String phone;
	private String mobile;
	private String fax;
	private String email;
	private String facebook;

	/**
	 * GET mobile
	 * 
	 * @return
	 */
	public String getMobile() {
		return mobile;
	}
	
	/**
	 * SET mobile
	 * 
	 * @param mobile
	 */
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	
	/**
	 * GET fax
	 * 
	 * @return
	 */
	public String getFax() {
		return fax;
	}
	
	/**
	 * SET fax
	 * @param fax
	 */
	public void setFax(String fax) {
		this.fax = fax;
	}
	
	/**
	 * GET facebook
	 * 
	 * @return
	 */
	public String getFacebook() {
		return facebook;
	}
	
	/**
	 * SET facebook
	 * 
	 * @param facebook
	 */
	public void setFacebook(String facebook) {
		this.facebook = facebook;
	}
	
	/**
	 * GET phone
	 * 
	 * @return
	 */
	public String getPhone() {
		return phone;
	}
	
	/**
	 * SET phone
	 * 
	 * @param phone
	 */
	public void setPhone(String phone) {
		this.phone = phone;
	}
	
	/**
	 * GET email
	 * 
	 * @return
	 */
	public String getEmail() {
		return email;
	}
	
	/**
	 * SET email
	 * 
	 * @param email
	 */
	public void setEmail(String email) {
		this.email = email;
	}

}
