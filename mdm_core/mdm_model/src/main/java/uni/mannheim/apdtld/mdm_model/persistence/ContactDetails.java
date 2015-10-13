package uni.mannheim.apdtld.mdm_model.persistence;

import java.io.Serializable;

import javax.persistence.Embeddable;

@Embeddable
public class ContactDetails implements Serializable {
	// constants
	private static final long serialVersionUID = 1L;
	
	private String phone;
	private String mobile;
	private String fax;
	private String email;
	private String facebook;
	

	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public String getFax() {
		return fax;
	}
	public void setFax(String fax) {
		this.fax = fax;
	}
	public String getFacebook() {
		return facebook;
	}
	public void setFacebook(String facebook) {
		this.facebook = facebook;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}

}
