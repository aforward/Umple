/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.18.0.3036 modeling language!*/

package cruise.vml;

/**
 * A piece of code (typically umple) that will be
 * selected to be added to a product line if
 * a certain variant within a variation point is
 * selected.
 * @umplesource Vml.ump 84
 * @umplesource Vml_Code.ump 111
 * @umplesource Vml_Code.ump 408
 */
// line 84 "../../../src/Vml.ump"
// line 111 "../../../src/Vml_Code.ump"
// line 408 "../../../src/Vml_Code.ump"
public class CodeSnippet
{
  @java.lang.annotation.Retention(java.lang.annotation.RetentionPolicy.RUNTIME)
  public @interface umplesourcefile{int[] line();String[] file();int[] javaline();int[] length();}

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //CodeSnippet Attributes
  private String code;

  //Helper Variables
  private int cachedHashCode;
  private boolean canSetCode;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public CodeSnippet(String aCode)
  {
    cachedHashCode = -1;
    canSetCode = true;
    code = aCode;
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setCode(String aCode)
  {
    boolean wasSet = false;
    if (!canSetCode) { return false; }
    code = aCode;
    wasSet = true;
    return wasSet;
  }

  public String getCode()
  {
    return code;
  }

  public boolean equals(Object obj)
  {
    if (obj == null) { return false; }
    if (!getClass().equals(obj.getClass())) { return false; }

    CodeSnippet compareTo = (CodeSnippet)obj;
  
    if (code == null && compareTo.code != null)
    {
      return false;
    }
    else if (code != null && !code.equals(compareTo.code))
    {
      return false;
    }

    return true;
  }

  public int hashCode()
  {
    if (cachedHashCode != -1)
    {
      return cachedHashCode;
    }
    cachedHashCode = 17;
    if (code != null)
    {
      cachedHashCode = cachedHashCode * 23 + code.hashCode();
    }
    else
    {
      cachedHashCode = cachedHashCode * 23;
    }

    canSetCode = false;
    return cachedHashCode;
  }

  public void delete()
  {}

  @umplesourcefile(line={116},file={"Vml_Code.ump"},javaline={107},length={10})
   public String toString(){
    if (code == null)
    {
      return "";
    }
    else
    {
      return code;
    }
  }

}