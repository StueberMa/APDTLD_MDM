package uni.mannheim.apdtld.mdm_model.persistence;

import java.io.Serializable;
import java.util.Calendar;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 * Entity Campaign.
 * 
 * @author APDTLD_MDM @ Uni Mannheim
 * @version 23.10.2015
 */
@Entity
public class Campaign implements Serializable {

	// constants
		private static final long serialVersionUID = 1L;

	// attributes
	@Id
	@GeneratedValue
	private int id;
	private String name;
	private String type;
	private String description;
	private String status;
	
	@Temporal(TemporalType.DATE)
	private Calendar startDate;
	@Temporal(TemporalType.DATE)
	private Calendar endDate;
	private double plannedCosts;
	private double costs;
	private int numberSend;
	private int plannedReceived;
	
	private int numberReceived;
	private int numberLeads;
	private int numberOpport;
	private int valueOpport;
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getType() {
		return type;
	}
	
	public void setType(String type) {
		this.type = type;
	}
	
	public String getDescription() {
		return description;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	public String getStatus() {
		return status;
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
	
	public Calendar getStartDate() {
		return startDate;
	}
	
	public void setStartDate(Calendar startDate) {
		this.startDate = startDate;
	}
	
	public Calendar getEndDate() {
		return endDate;
	}
	
	public void setEndDate(Calendar endDate) {
		this.endDate = endDate;
	}
	
	public double getPlannedCosts() {
		return plannedCosts;
	}
	
	public void setPlannedCosts(double plannedCosts) {
		this.plannedCosts = plannedCosts;
	}
	
	public double getCosts() {
		return costs;
	}
	
	public void setCosts(double costs) {
		this.costs = costs;
	}
	
	public int getNumberSend() {
		return numberSend;
	}
	
	public void setNumberSend(int numberSend) {
		this.numberSend = numberSend;
	}
	
	public int getPlannedReceived() {
		return plannedReceived;
	}
	
	public void setPlannedReceived(int plannedReceived) {
		this.plannedReceived = plannedReceived;
	}

	public int getNumberReceived() {
		return numberReceived;
	}

	public void setNumberReceived(int numberReceived) {
		this.numberReceived = numberReceived;
	}

	public int getNumberLeads() {
		return numberLeads;
	}

	public void setNumberLeads(int numberLeads) {
		this.numberLeads = numberLeads;
	}

	public int getNumberOpport() {
		return numberOpport;
	}

	public void setNumberOpport(int numberOpport) {
		this.numberOpport = numberOpport;
	}

	public int getValueOpport() {
		return valueOpport;
	}

	public void setValueOpport(int valueOpport) {
		this.valueOpport = valueOpport;
	}
}
