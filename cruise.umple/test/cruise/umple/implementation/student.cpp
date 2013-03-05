/* EXPERIMENTAL CODE - NON COMPILEABLE VERSION OF C++ */
/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.16.0.2388 modeling language!*/

#include "student.h"

	
  //------------------------
  // CONSTRUCTOR
  //------------------------
  
 student::student(const int & aAge)
  {
    if ( !(aAge>18))
    { 
     throw "Please provide a valid age"; 
    }
    age = aAge;
  }
  
  //------------------------
  // COPY CONSTRUCTOR
  //------------------------

 student::student(const student & student)
  {
    this->age = student.age;
  }
  	
  //------------------------
  // Operator =
  //------------------------

 student student::operator=(const student & student)
  {
    this->age = student.age;
  }

  //------------------------
  // INTERFACE
  //------------------------

  bool student::setAge(const int & aAge)
  {
    bool wasSet = false;
    if (aAge>18)
    {
    age = aAge;
    wasSet = true;
    }
    return wasSet;
  }

  int student::getAge() const
  {
    return age;
  }

  
  //------------------------
  // DESTRUCTOR
  //------------------------
  
student::~student()
  {}

