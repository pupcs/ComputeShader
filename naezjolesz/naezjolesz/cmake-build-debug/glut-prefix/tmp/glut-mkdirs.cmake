# Distributed under the OSI-approved BSD 3-Clause License.  See accompanying
# file Copyright.txt or https://cmake.org/licensing for details.

cmake_minimum_required(VERSION 3.5)

file(MAKE_DIRECTORY
  "C:/Users/Csongor/OneDrive/Dokumentumok/GitHub/ComputeShader/naezjolesz/naezjolesz/src/freeglut"
  "C:/Users/Csongor/OneDrive/Dokumentumok/GitHub/ComputeShader/naezjolesz/naezjolesz/cmake-build-debug/glut-prefix/src/glut-build"
  "C:/Users/Csongor/OneDrive/Dokumentumok/GitHub/ComputeShader/naezjolesz/naezjolesz/cmake-build-debug/glut-prefix"
  "C:/Users/Csongor/OneDrive/Dokumentumok/GitHub/ComputeShader/naezjolesz/naezjolesz/cmake-build-debug/glut-prefix/tmp"
  "C:/Users/Csongor/OneDrive/Dokumentumok/GitHub/ComputeShader/naezjolesz/naezjolesz/cmake-build-debug/glut-prefix/src/glut-stamp"
  "C:/Users/Csongor/OneDrive/Dokumentumok/GitHub/ComputeShader/naezjolesz/naezjolesz/cmake-build-debug/glut-prefix/src"
  "C:/Users/Csongor/OneDrive/Dokumentumok/GitHub/ComputeShader/naezjolesz/naezjolesz/cmake-build-debug/glut-prefix/src/glut-stamp"
)

set(configSubDirs )
foreach(subDir IN LISTS configSubDirs)
    file(MAKE_DIRECTORY "C:/Users/Csongor/OneDrive/Dokumentumok/GitHub/ComputeShader/naezjolesz/naezjolesz/cmake-build-debug/glut-prefix/src/glut-stamp/${subDir}")
endforeach()
if(cfgdir)
  file(MAKE_DIRECTORY "C:/Users/Csongor/OneDrive/Dokumentumok/GitHub/ComputeShader/naezjolesz/naezjolesz/cmake-build-debug/glut-prefix/src/glut-stamp${cfgdir}") # cfgdir has leading slash
endif()
