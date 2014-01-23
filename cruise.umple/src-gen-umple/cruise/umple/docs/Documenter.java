/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE ${last.version} modeling language!*/

package cruise.umple.docs;
import java.io.*;
import java.net.*;
import cruise.umple.util.*;
import cruise.umple.compiler.*;
import java.util.*;

/**
 * The tool to create the html text of the Umple user manual
 * @umplesource Documenter.ump 16
 * @umplesource Documenter_Code.ump 49
 */
// line 16 "../../../../src/Documenter.ump"
// line 49 "../../../../src/Documenter_Code.ump"
public class Documenter
{
  @java.lang.annotation.Retention(java.lang.annotation.RetentionPolicy.RUNTIME)
  public @interface umplesourcefile{int[] line();String[] file();int[] javaline();int[] length();}

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Documenter Attributes
  private String inputPath;
  private String outputPath;
  private List<String> messages;

  //Documenter Associations
  private ContentParser parser;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Documenter(String aInputPath, String aOutputPath)
  {
    inputPath = aInputPath;
    outputPath = aOutputPath;
    messages = new ArrayList<String>();
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setInputPath(String aInputPath)
  {
    boolean wasSet = false;
    inputPath = aInputPath;
    wasSet = true;
    return wasSet;
  }

  public boolean setOutputPath(String aOutputPath)
  {
    boolean wasSet = false;
    outputPath = aOutputPath;
    wasSet = true;
    return wasSet;
  }

  public boolean addMessage(String aMessage)
  {
    boolean wasAdded = false;
    wasAdded = messages.add(aMessage);
    return wasAdded;
  }

  public boolean removeMessage(String aMessage)
  {
    boolean wasRemoved = false;
    wasRemoved = messages.remove(aMessage);
    return wasRemoved;
  }

  public String getInputPath()
  {
    return inputPath;
  }

  public String getOutputPath()
  {
    return outputPath;
  }

  public String getMessage(int index)
  {
    String aMessage = messages.get(index);
    return aMessage;
  }

  public String[] getMessages()
  {
    String[] newMessages = messages.toArray(new String[messages.size()]);
    return newMessages;
  }

  public int numberOfMessages()
  {
    int number = messages.size();
    return number;
  }

  public boolean hasMessages()
  {
    boolean has = messages.size() > 0;
    return has;
  }

  public int indexOfMessage(String aMessage)
  {
    int index = messages.indexOf(aMessage);
    return index;
  }

  public ContentParser getParser()
  {
    return parser;
  }

  public boolean setParser(ContentParser aNewParser)
  {
    boolean wasSet = false;
    parser = aNewParser;
    wasSet = true;
    return wasSet;
  }

  public void delete()
  {
    parser = null;
  }

  @umplesourcefile(line={55},file={"Documenter_Code.ump"},javaline={140},length={30})
   public boolean generate(){
    File inputDirectory = new File(getInputPath());
    if (!inputDirectory.exists())
    {
      addMessage("Unknown directory: " + getInputPath());
      return false;
    }

    setParser(new ContentParser("content"));

    parseGroupOrder(inputDirectory);
    parseContent(inputDirectory);
    
    if (getParser().analyze().getWasSuccess())
    {
      String message = "Created Groups:";
      for (Group g : getParser().getGroups())
      {
        message += " [" + g.getName() + "]";
      }
      addMessage(message);
      publish(getOutputPath());
      return true;
    }
    else
    {
      addMessage("Unable to analyze files in " + getInputPath());
      return false;
    }
  }

  @umplesourcefile(line={87},file={"Documenter_Code.ump"},javaline={172},length={59})
   public boolean publish(String path){
    File file = new File(path);
    file.mkdirs();
    String navigationOutput = "";
    String sectionsToHide = "";
    String prevNextOutput = "";
    Group group = null;
    Content content = null;
    int numGroups = getParser().numberOfGroups();
    int numContents = 0;

    Hashtable<String,String> referenceLookup = createReferenceLookup();
    for (int gi=0; gi<numGroups; gi++)
    {
      group = getParser().getGroup(gi);
      sectionsToHide = toSectionsToHideHtml(group);
      numContents = group.numberOfContents();
      for (int ci=0; ci<numContents; ci++)
      {
        content = group.getContent(ci);
        navigationOutput = toNavigationHtml(group, content);
        if (content.getShouldIncludeReferences())
        {
          updateReferences(content,referenceLookup);
        }
        
        prevNextOutput="&nbsp; &nbsp;";

        // Add file link to previous page if there is one
        if(ci>0) {
          prevNextOutput +="<a href=\"" + group.getContent(ci-1).getTitleFilename() + "\">[Previous]</a>&nbsp &nbsp;";
        }
        else if(gi > 0) {
          prevNextOutput +="<a href=\"" + getParser().getGroup(gi-1).getContent(getParser().getGroup(gi-1).numberOfContents()-1).getTitleFilename() + "\">[Previous]</a>&nbsp &nbsp;";
        }

        // Add file link to next page if there is one
        if(ci<(numContents -1)) {
          prevNextOutput +="<a href=\"" + group.getContent(ci+1).getTitleFilename() + "\">[Next]</a>&nbsp; &nbsp;";
        }
        else if(gi<(numGroups -1)) {
          prevNextOutput +="<a href=\"" + getParser().getGroup(gi+1).getContent(0).getTitleFilename() + "\">[Next]</a>&nbsp &nbsp;";
        }
        
        String htmlOutput = toHtml(content, navigationOutput, sectionsToHide, prevNextOutput);
        
        if (htmlOutput.length() == 0)
        {
          addMessage("Failed on: " + content.getTitle());
          return false;
        }
        
        String filename = path + File.separator + content.getTitleFilename();
        SampleFileWriter.createFile(filename,htmlOutput);
        addMessage("Created: " + filename);
      }
    }
    return true;
  }

  @umplesourcefile(line={148},file={"Documenter_Code.ump"},javaline={233},length={19})
   public String toHtml(String title){
    Content selectedContent = null;
    Group selectedGroup = null;
    
    for (Group group : getParser().getGroups())
    {
      for (Content content : group.getContents())
      {
        if (content.getTitle().equals(title))
        {
          selectedContent = content;
          selectedGroup = group;
          break;
        }
      }
    }
    
    return toHtml(selectedContent, toNavigationHtml(selectedGroup, selectedContent),  toSectionsToHideHtml(selectedGroup), "");
  }

  @umplesourcefile(line={182},file={"Documenter_Code.ump"},javaline={254},length={25})
   private void updateReferences(Content content, Hashtable<String,String> referenceLookup){
    String newSyntax = content.getSyntax();
    String newDescription = content.getDescription();
    for(Iterator<String> iTitle = referenceLookup.keySet().iterator(); iTitle.hasNext();)
    {
      String title = iTitle.next();
      String titleFilename = referenceLookup.get(title);
      
      if (title.equals(content.getTitle()))
      {
        continue;
      }
      
      if (newSyntax != null)
      {
        newSyntax = newSyntax.replaceAll(title, StringFormatter.format("<a href=\"{1}\">{0}</a>",title,titleFilename));
      }
      if (newDescription != null)
      {
        newDescription = newDescription.replaceAll(title, StringFormatter.format("<a href=\"{1}\">{0}</a>",title,titleFilename));
      }
    }
    content.setSyntax(newSyntax);
    content.setDescription(newDescription);
  }

  @umplesourcefile(line={209},file={"Documenter_Code.ump"},javaline={281},length={13})
   private void parseContent(File inputDirectory){
    File[] allFiles = SampleFileWriter.getAllFiles(inputDirectory);
    for (File aFile : allFiles)
    {
      if (aFile.getName().endsWith(".txt"))
      {
        if (!getParser().parse("content", SampleFileWriter.readContent(aFile)).getWasSuccess())
        {
          addMessage("Unable to parse "+ getParser().getParseResult().getPosition() +": " + aFile.getName() );
        }
      }
    }
  }

  @umplesourcefile(line={224},file={"Documenter_Code.ump"},javaline={296},length={10})
   private void parseGroupOrder(File inputDirectory){
    File[] allFiles = SampleFileWriter.getAllFiles(inputDirectory);
    for (File aFile : allFiles)
    {
      if ("order.group".equals(aFile.getName()))
      {
        getParser().parse("groupOrder", SampleFileWriter.readContent(aFile));
      }
    }
  }

  @umplesourcefile(line={236},file={"Documenter_Code.ump"},javaline={308},length={53})
   private String toHtml(Content selectedContent, String navigationOutput, String toHideOutput, String prevNextOutput){
    int endOfExampleBeforePosition=0;
    
    if (selectedContent == null)
    {
      return "";
    }
    
    UmpleInternalParser grammarparser = new UmpleInternalParser();
    for(String file:grammarparser.getParser().getGrammarFiles()){
      grammarparser.addRulesInFile(file);
    }
    
    String htmlOutput = Template.HtmlTemplate;
    htmlOutput = htmlOutput.replace("@@TITLE@@", selectedContent.getTitle());
    htmlOutput = htmlOutput.replace("@@PREVNEXT@@", prevNextOutput);
    htmlOutput = htmlOutput.replace("@@NAVIGATION@@", navigationOutput);
    htmlOutput = htmlOutput.replace("@@SECTIONSTOHIDE@@", toHideOutput);

    htmlOutput = htmlOutput.replace("@@DESCRIPTION@@", selectedContent.getDescription());
    
    if (selectedContent.getSyntax() == null)
    {
      htmlOutput = htmlOutput.replace("@@SYNTAX@@", "");
    }
    else
    {
      String syntaxHtml = Template.SyntaxTemplate.replace("@@SYNTAX_CODE@@",grammarparser.toGrammarParts(selectedContent.getSyntax()));
      htmlOutput = htmlOutput.replace("@@SYNTAX@@", syntaxHtml);
    }
    
    String exampleOutput = "";
    for (String example : selectedContent.getExamples())
    {
      String nextExample = Template.ExampleTemplate;
      String exampleHeader = exampleOutput.length() == 0 ? "Example" : "Another Example";
      nextExample = nextExample.replace("@@EXAMPLE_NUMBER@@",exampleHeader);
      
      endOfExampleBeforePosition = example.indexOf("//$?[End_of_model]$?");
      if(endOfExampleBeforePosition == -1) {endOfExampleBeforePosition = example.length();}
      nextExample = nextExample.replace("@@EXAMPLE_CODE@@", example.substring(0,endOfExampleBeforePosition));
      try {
        nextExample = nextExample.replace("@@EXAMPLE_CODE_URL@@",
            URLEncoder.encode(example,"UTF-8").replaceAll("\\+","%20").replaceAll("%2B","%252B"));
      }
      catch (java.io.UnsupportedEncodingException e) {
      }
      exampleOutput += nextExample;
    }
    htmlOutput = htmlOutput.replace("@@EXAMPLE@@", exampleOutput);
    htmlOutput = htmlOutput.replace("@@UMPLE_GRAMMAR@@", grammarparser.toGrammar());
    return htmlOutput;
  }

  @umplesourcefile(line={291},file={"Documenter_Code.ump"},javaline={363},length={31})
   private String toNavigationHtml(Group groupToAlwaysShow, Content contentToNotHighlight){
    String navigationOutput = "";
    String theFileName = "";
    String nextGroupItem = "";
    for (Group group : getParser().getGroups())
    {
      String nextGroupHeader = Template.NavigationHeaderTemplate;
      nextGroupHeader = nextGroupHeader
        .replace("@@NAVIGATION_HEADER_NAME@@",group.getName())
        .replace("@@NAVIGATION_HEADER_ID@@",group.getGroupIdName())
        .replace("@@NAVIGATION_HEADER_ID@@",group.getGroupIdName());
      navigationOutput += nextGroupHeader;

      for (Content content : group.getContents())
      {
        if(content == contentToNotHighlight) {
          nextGroupItem = Template.NavigationItemTemplateNoAnchor;
        }
        else {
          nextGroupItem = Template.NavigationItemTemplate;
        }
        nextGroupItem = nextGroupItem.replace("@@NAVIGATION_ITEM_NAME@@",content.getTitle());
        if(content != contentToNotHighlight) {
          nextGroupItem = nextGroupItem.replace("@@NAVIGATION_ITEM_FILENAME@@",content.getTitleFilename());
        }
        navigationOutput += nextGroupItem;
      }
      navigationOutput +="        </div>";
    }
    return navigationOutput;
  }

  @umplesourcefile(line={324},file={"Documenter_Code.ump"},javaline={396},length={10})
   private String toSectionsToHideHtml(Group groupToAlwaysShow){
    String sectionsToHideOutput = "";
    for (Group group : getParser().getGroups())
    {
      if(group != groupToAlwaysShow) {
        sectionsToHideOutput +="showHide(\"" + group.getGroupIdName() + "\");\n";
      }
    }
    return sectionsToHideOutput;
  }


  public String toString()
  {
	  String outputString = "";
    return super.toString() + "["+
            "inputPath" + ":" + getInputPath()+ "," +
            "outputPath" + ":" + getOutputPath()+ "]" + System.getProperties().getProperty("line.separator") +
            "  " + "parser = "+(getParser()!=null?Integer.toHexString(System.identityHashCode(getParser())):"null")
     + outputString;
  }  
  //------------------------
  // DEVELOPER CODE - PROVIDED AS-IS
  //------------------------
  //  @umplesourcefile(line={166},file={"Documenter_Code.ump"},javaline={420},length={13})
  @umplesourcefile(line={167},file={"Documenter_Code.ump"},javaline={421},length={12})
  private Hashtable<String, String> createReferenceLookup () 
  {
    Hashtable<String, String> referenceLookup = new Hashtable<String, String>();
    for (Group group : getParser().getGroups())
    {
      for (Content content : group.getContents())
      {
        referenceLookup.put(content.getTitle(), content.getTitleFilename());
      }
    }
    return referenceLookup;
  }

  
}