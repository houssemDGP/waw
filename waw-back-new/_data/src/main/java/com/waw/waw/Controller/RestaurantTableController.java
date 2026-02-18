package com.waw.waw.controller;

import com.waw.waw.entity.RestaurantTable;
import com.waw.waw.repository.RestaurantTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/restaurant-tables")
@CrossOrigin(origins = "*")
public class RestaurantTableController {
    
    @Autowired
    private RestaurantTableRepository tableRepository;
    
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<RestaurantTable>> getTablesByRestaurant(@PathVariable Long restaurantId) {
        List<RestaurantTable> tables = tableRepository.findByRestaurantId(restaurantId);
        return ResponseEntity.ok(tables);
    }
    @DeleteMapping("/{tableId}")
public ResponseEntity<Void> deleteTable(@PathVariable Long tableId) {
    if (!tableRepository.existsById(tableId)) {
        return ResponseEntity.notFound().build();
    }

    tableRepository.deleteById(tableId);
    return ResponseEntity.noContent().build();
}

    @GetMapping("/restaurant/{restaurantId}/active")
    public ResponseEntity<List<RestaurantTable>> getActiveTablesByRestaurant(@PathVariable Long restaurantId) {
        List<RestaurantTable> tables = tableRepository.findActiveTablesByRestaurant(restaurantId);
        return ResponseEntity.ok(tables);
    }
    
    @GetMapping("/place/{placeId}")
    public ResponseEntity<List<RestaurantTable>> getTablesByPlace(@PathVariable Long placeId) {
        List<RestaurantTable> tables = tableRepository.findByPlaceId(placeId);
        return ResponseEntity.ok(tables);
    }
    
    @GetMapping("/capacity/{restaurantId}/{guests}")
    public ResponseEntity<List<RestaurantTable>> getTablesByCapacity(
            @PathVariable Long restaurantId,
            @PathVariable Integer guests) {
        List<RestaurantTable> tables = tableRepository.findTablesByCapacity(restaurantId, guests);
        return ResponseEntity.ok(tables);
    }
    
    @PostMapping
    public ResponseEntity<RestaurantTable> createTable(@RequestBody RestaurantTable table) {
        RestaurantTable savedTable = tableRepository.save(table);
        return ResponseEntity.ok(savedTable);
    }
    
@PutMapping("/{id}")
public ResponseEntity<RestaurantTable> updateTable(@PathVariable Long id, @RequestBody RestaurantTable tableDetails) {
    return tableRepository.findById(id)
            .map(table -> {
                table.setTableNumber(tableDetails.getTableNumber());
                table.setName(tableDetails.getName());
                table.setMinCapacity(tableDetails.getMinCapacity());
                table.setMaxCapacity(tableDetails.getMaxCapacity());
                table.setPricePerPerson(tableDetails.getPricePerPerson());
                table.setPricePerPersonEnfant(tableDetails.getPricePerPersonEnfant()); 
                table.setPricePerPersonBebe(tableDetails.getPricePerPersonBebe());    
                table.setTableType(tableDetails.getTableType());
                table.setIsActive(tableDetails.getIsActive());
                return ResponseEntity.ok(tableRepository.save(table));
            })
            .orElse(ResponseEntity.notFound().build());
}
    
    @PutMapping("/{id}/toggle-active")
    public ResponseEntity<RestaurantTable> toggleActive(@PathVariable Long id) {
        return tableRepository.findById(id)
                .map(table -> {
                    table.setIsActive(!table.getIsActive());
                    return ResponseEntity.ok(tableRepository.save(table));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}