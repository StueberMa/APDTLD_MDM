package uni.mannheim.apdtld.mdm_view.services;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Serializable;
import java.io.Writer;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.naming.NamingException;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import javax.persistence.PersistenceUnit;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.persistence.metamodel.Attribute;
import javax.persistence.metamodel.EmbeddableType;
import javax.persistence.metamodel.EntityType;
import javax.persistence.metamodel.ManagedType;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transaction;

import org.apache.commons.lang3.StringUtils;

import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.opencsv.CSVReader;

import uni.mannheim.apdtld.mdm_model.persistence.Customer;
import uni.mannheim.apdtld.mdm_view.odata.JpaEntityManagerFactory;
import uni.mannheim.apdtld.mdm_view.odata.ODataJPAServiceFactory;
import uni.mannheim.apdtld.mdm_view.services.gsonmodel.Mapping;
import uni.mannheim.apdtld.mdm_view.services.gsonmodel.MappingArray;

public class Exporter extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Set<Table> tables = null;
	
	public void init() {
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	
		/*Writer out = response.getWriter();
		
		StringBuffer jb = new StringBuffer();
		String line = null;
		try {
			BufferedReader reader = request.getReader();
			while ((line = reader.readLine()) != null)
				jb.append(line);
		} catch (Exception e) {  }

		MappingArray mappingsArray = new GsonBuilder().create().fromJson(jb.toString(), MappingArray.class);
		HashMap<String, HashSet<Mapping>> mappings = mappingsArray.getMappingMap();
		
		EntityManagerFactory fac;
		try {
			fac = JpaEntityManagerFactory.getEntityManagerFactory("data_model");
			EntityManager em = fac.createEntityManager();
			
			CSVReader reader = new CSVReader(new FileReader(filePath + request.getParameter("file")), ';');
			String[] nextLine;
			String[] header = reader.readNext();

			while ((nextLine = reader.readNext()) != null) {
				HashMap<String, Object> typeEntityMap = new HashMap<String, Object>();
				HashMap<String, Object> typeEmebeddableMap = new HashMap<String, Object>();
				int column = 0;
				for(String attribute:nextLine) {
					HashSet<Mapping> attributeMappings = mappings.get(header[column]);
					if(attributeMappings==null) {
						column++;
						continue; //mapping for attribute in file was not specified
					}
					for(Mapping mapping:attributeMappings){
						String[] dbNameParticles = mapping.dbName.split("\\."); // table.attribute
						Object object;
						String className = null;
						String parentName = null;
						String attributeName = null;
						HashMap<String, Object> store = null;
						if(dbNameParticles.length==2) {
							className = dbNameParticles[0];
							attributeName = dbNameParticles[1];
							store = typeEntityMap;
						} else if(dbNameParticles.length==3) {
							parentName = dbNameParticles[0];
							className = dbNameParticles[1];
							attributeName = dbNameParticles[2];
							store = typeEmebeddableMap;
						}
						if(!store.containsKey(className)) {
							Class<?> prototype = Class.forName("uni.mannheim.apdtld.mdm_model.persistence." + className);
							Constructor<?> ctor = prototype.getConstructor();
							object = ctor.newInstance();
							store.put(className, object);
							if(dbNameParticles.length==3) {
								Object parentObject = null;
								if(typeEntityMap.containsKey(parentName)) {
									parentObject = typeEntityMap.get(parentName);
								}
								if(parentObject==null) {
									Class<?> parentPrototype = Class.forName("uni.mannheim.apdtld.mdm_model.persistence." + parentName);
									Constructor<?> parentCtor = parentPrototype.getConstructor();
									parentObject = parentCtor.newInstance();
									typeEntityMap.put(parentName, parentObject);
								}
								
								char c[] = className.toCharArray();
								c[0] = Character.toLowerCase(c[0]);
								Field f = parentObject.getClass().getDeclaredField(new String(c));
								boolean acc = f.isAccessible();
								f.setAccessible(true);
								f.set(parentObject, object);
								f.setAccessible(acc);
							}
						} else {
							object = store.get(className);
						}
						
						Object attributeObject = null;
						if(mapping.fType.equals("Text")) {
							attributeObject = attribute;
						} else if(mapping.fType.equals("Number")) {
							attributeObject = Double.parseDouble(attribute);
						} else if(mapping.fType.equals("Date")) {
							Calendar cal = new GregorianCalendar();
							cal.setTime((new SimpleDateFormat("dd.MM.yyyy")).parse(attribute));
							attributeObject = cal;
						}
						Field f = object.getClass().getDeclaredField(attributeName);
						boolean acc = f.isAccessible();
						f.setAccessible(true);
						f.set(object, attributeObject);
						f.setAccessible(acc);
					}
					column++;
				}
				
				for(Object object:typeEntityMap.values()) {
					EntityTransaction ext = em.getTransaction();
					ext.begin();
					em.persist(object);
					em.flush();
					ext.commit();
				}				
			}
			em.close();
			reader.close();
			
		} catch (Exception e) {
			e.printStackTrace();
			out.write(e.getMessage());
			// Please don't :)
		}
		out.write("{}");*/
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");
		
		JsonObject json = new JsonObject();
		Writer out = response.getWriter();
		
		this.analyseDatabaseStructure();
						
		JsonArray jsonTables = new JsonArray();
		for(Table table:this.tables) {
			JsonObject jsonTable = new JsonObject();
			jsonTable.addProperty("name", table.getName());
			JsonArray[] jsonAttributes = new JsonArray[4];
			jsonAttributes[0] = new JsonArray();
			jsonAttributes[1] = new JsonArray();
			jsonAttributes[2] = new JsonArray();
			jsonAttributes[3] = new JsonArray();
			int i=0;
			for(Map.Entry<String, AttributeTupel> entry:table.getAttributeInfo().entrySet()) {
				JsonObject jsonAttribute = new JsonObject();
				jsonAttribute.addProperty("name", entry.getKey());
				jsonAttribute.addProperty("selected", "true");
				jsonAttributes[i++%4].add(jsonAttribute);
			}
			jsonTable.add("attributes_0", jsonAttributes[0]);
			jsonTable.add("attributes_1", jsonAttributes[1]);
			jsonTable.add("attributes_2", jsonAttributes[2]);
			jsonTable.add("attributes_3", jsonAttributes[3]);
			jsonTables.add(jsonTable);
		}
		
		json.add("database_tables", jsonTables);
		out.write(json.toString());
		
	}
	
	private void analyseDatabaseStructure() {
		this.tables = new HashSet<Table>();
		
		HashMap<String, Table> embedables = new HashMap<>();
		
		try {
			EntityManagerFactory fac = JpaEntityManagerFactory.getEntityManagerFactory("data_model");
			
			Set<EmbeddableType<?>> embeddables = fac.getMetamodel().getEmbeddables();
			Iterator<EmbeddableType<?>> it2 = embeddables.iterator();
			while(it2.hasNext()) {
				EmbeddableType<?> o = it2.next();
				String[] fullyQualifiedNameParts = o.getJavaType().getName().split("\\.");
				String name = fullyQualifiedNameParts[fullyQualifiedNameParts.length-1];
				Table table = new Table(name);
				for(Attribute<?,?> attr : o.getAttributes()) {
					String type = attr.getJavaType().getName();
					if(type.indexOf("String")>0) {
						type = "Text";
					} else if(type.indexOf("int")>=0 || type.indexOf("float")>=0 || type.indexOf("double")>=0) {
						type = "Number";
					} else if(type.equals("java.util.Calendar")) {
						type = "Date";
					} else {
						type = "ref";
					}
					
					String sample = "";
					/*List<?> rows = fac.createEntityManager()
							.createQuery("Select t From " + o.getName() + " t")
							//.setMaxResults(10)
							.getResultList();

					for(Object row:rows) {
						Class<?> c = row.getClass();
						Field f = c.getDeclaredField(attr.getName());
						boolean acc = f.isAccessible();
						f.setAccessible(true);
						sample += f.get(row) + "; ";
						f.setAccessible(acc);
					}*/
					
					if(!type.equals("ref")) {
						table.addAttribute(attr.getName(), type, sample);
					}
				}
				embedables.put(name, table);
			}
			
			//EntityManager em = fac.createEntityManager();
			Set<EntityType<?>> entities = fac.getMetamodel().getEntities();
			Iterator<EntityType<?>> it = entities.iterator();
			while(it.hasNext()) {
				EntityType<?> o = it.next();
				Table table = new Table(o.getName());
				for(Attribute<?,?> attr : o.getAttributes()) {
					String type = attr.getJavaType().getName();
					if(type.indexOf("String")>0) {
						type = "Text";
					} else if(type.indexOf("int")>=0 || type.indexOf("float")>=0 || type.indexOf("double")>=0) {
						type = "Number";
					} else if(type.equals("java.util.Calendar")) {
						type = "Date";
					} else {
						String[] fullyQualifiedNameParts = type.split("\\.");
						String name = fullyQualifiedNameParts[fullyQualifiedNameParts.length-1];
						if(embedables.containsKey(name)) {
							Table embeddedTable = embedables.get(name);
							for(AttributeTupel attribute:embeddedTable.getAttributeInfo().values()) {
								table.addAttribute(name + "." + attribute.name, attribute.type, attribute.sample);
							}
						}
						type = "ref";
					}

					String sample = "";
					List<?> rows = fac.createEntityManager()
							.createQuery("Select t From " + o.getName() + " t")
							//.setMaxResults(10)
							.getResultList();

					for(Object row:rows) {
						Class<?> c = row.getClass();
						Field f = c.getDeclaredField(attr.getName());
						boolean acc = f.isAccessible();
						f.setAccessible(true);
						sample += f.get(row) + "; ";
						f.setAccessible(acc);
					}
					
					if(!type.equals("ref")) {
						table.addAttribute(attr.getName(), type, sample);
					}
				}
				this.tables.add(table);
			}
		} catch (NamingException e) {
		} catch (SQLException e) {
		} catch (Exception e) {
		}
	}
	
	private String shortenSample(String sample) {
		if(sample.length()>15) {
			return sample.substring(0, 15) + "...";
		} else if(sample.length()>2){
			return sample;
		} else {
			return "";
		}
	}
}
